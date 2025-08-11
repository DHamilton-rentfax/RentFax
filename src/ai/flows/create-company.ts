'use server';
/**
 * @fileOverview A Genkit flow to securely create a new company and assign the caller as the owner.
 */
import { onFlow } from '@genkit-ai/next/server';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

const CreateCompanyInputSchema = z.object({
  name: z.string().describe('The name of the new company.'),
});

const CreateCompanyOutputSchema = z.object({
  companyId: z.string(),
});

export const createCompany = onFlow(
  {
    name: 'createCompany',
    inputSchema: CreateCompanyInputSchema,
    outputSchema: CreateCompanyOutputSchema,
    authPolicy: (auth, input) => {
      if (!auth) {
        throw new Error('Authentication is required to create a company.');
      }
    },
  },
  async ({ name }, { auth }) => {
    if (!auth) throw new Error('Auth context is missing.');

    // Caller becomes owner of this company if not already part of one
    const caller = await admin.auth().getUser(auth.uid);
    const claims = caller.customClaims || {};
    if (claims.companyId) {
      throw new Error('User already belongs to a company.');
    }

    const slugPart = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32);
    const companyId = `${slugPart}-${Math.random().toString(36).slice(2, 6)}`;

    await db.doc(`companies/${companyId}`).set({
      name,
      timezone: 'America/New_York', // Default timezone
      plan: 'starter',
      status: 'active',
      seats: 3,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Assign owner claims to caller
    await admin.auth().setCustomUserClaims(auth.uid, { role: 'owner', companyId });
    await admin.auth().revokeRefreshTokens(auth.uid);

    return { companyId };
  }
);
