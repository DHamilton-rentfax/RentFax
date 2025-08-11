'use server';
/**
 * @fileOverview Genkit flows for managing incidents.
 */

import { onFlow } from '@genkit-ai/flow/experimental';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import { recomputeRenterScore } from './risk-scorer';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

type IncidentType = 'late_return'|'damage'|'smoking'|'chargeback'|'theft_suspected'|'unpaid_balance'|'rule_violation';
type Severity = 'minor'|'major'|'severe';

const CreateIncidentSchema = z.object({
  renterId: z.string(),
  rentalId: z.string().optional().nullable(),
  type: z.string(), // Should be IncidentType
  severity: z.enum(['minor', 'major', 'severe']),
  amount: z.number().optional(),
  notes: z.string().optional(),
  attachments: z.array(z.object({ name: z.string(), path: z.string(), thumbPath: z.string().optional() })).optional(),
});

export const createIncident = onFlow(
  {
    name: 'createIncident',
    inputSchema: CreateIncidentSchema,
    outputSchema: z.object({ id: z.string(), created: z.boolean() }),
    authPolicy: async (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
        const { companyId, role } = (await admin.auth().getUser(auth.uid)).customClaims || {};
        if (!['owner','manager','agent','collections'].includes(role)) throw new Error('Insufficient permissions.');
    },
  },
  async (incidentData, { auth }) => {
    if (!auth) throw new Error('Auth context is missing.');
    const { companyId } = (await admin.auth().getUser(auth.uid)).customClaims || {};
    if (!companyId) throw new Error('User is not associated with a company.');

    const { renterId } = incidentData;

    const renterDoc = await db.collection('renters').doc(renterId).get();
    if (!renterDoc.exists || renterDoc.data()?.companyId !== companyId) {
        throw new Error('Renter not found for this company.');
    }

    const payload = {
        ...incidentData,
        companyId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const newIncidentRef = await db.collection('incidents').add(payload);
    
    // After creating, recompute score
    await recomputeRenterScore({ renterId });
    
    return { id: newIncidentRef.id, created: true };
  }
);
