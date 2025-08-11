'use server';
/**
 * @fileOverview Genkit flows for managing rental records.
 */
import { onFlow } from '@genkit-ai/next/server';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

const UpsertRentalSchema = z.object({
  id: z.string().optional(),
  renterId: z.string(),
  vehicleId: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  status: z.enum(['active', 'completed', 'cancelled', 'overdue']),
  depositAmount: z.number().optional(),
  dailyRate: z.number().optional(),
  notes: z.string().optional(),
  contractUrl: z.string().optional(),
});

export const upsertRental = onFlow(
  {
    name: 'upsertRental',
    inputSchema: UpsertRentalSchema,
    outputSchema: z.object({ id: z.string(), updated: z.boolean().optional(), created: z.boolean().optional() }),
    authPolicy: async (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
        const caller = await admin.auth().getUser(auth.uid);
        const claims = (caller.customClaims || {}) as any;
        if (!['owner','manager','agent'].includes(claims.role)) throw new Error('Insufficient permissions.');
    },
  },
  async (rentalData, { auth }) => {
    if (!auth) throw new Error('Auth context is missing.');
    const { companyId } = (await admin.auth().getUser(auth.uid)).customClaims || {};
    if (!companyId) throw new Error('User is not associated with a company.');

    const { id, ...data } = rentalData;

    // Validate renter exists in the same company
    const renterDoc = await db.collection('renters').doc(data.renterId).get();
    if (!renterDoc.exists || renterDoc.data()?.companyId !== companyId) {
        throw new Error('Renter not found for this company.');
    }
    
    const payload = {
        ...data,
        companyId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    if (id) {
        const rentalRef = db.collection('rentals').doc(id);
        await rentalRef.update(payload);
        return { id, updated: true };
    } else {
        const newRentalRef = await db.collection('rentals').add({
            ...payload,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { id: newRentalRef.id, created: true };
    }
  }
);


export const deleteRental = onFlow({
    name: 'deleteRental',
    inputSchema: z.object({ id: z.string() }),
    outputSchema: z.object({ deleted: z.boolean() }),
    authPolicy: async (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
        const caller = await admin.auth().getUser(auth.uid);
        const claims = (caller.customClaims || {}) as any;
        if (!['owner','manager'].includes(claims.role)) throw new Error('Insufficient permissions.');

        const rentalDoc = await db.collection('rentals').doc(input.id).get();
        if (!rentalDoc.exists) throw new Error('Rental not found');
        if (rentalDoc.data()?.companyId !== claims.companyId) {
            throw new Error('Permission denied to delete this rental.');
        }
    },
}, async ({id}) => {
    await db.collection('rentals').doc(id).delete();
    return { deleted: true };
});
