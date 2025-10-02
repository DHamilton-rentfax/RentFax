'use server';
/**
 * @fileOverview A Genkit flow to securely create a new company and assign the caller as the owner.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {FlowAuth} from 'genkit/flow';
import { admin, dbAdmin as db, authAdmin } from '@/lib/firebase-admin';


const CreateCompanyInputSchema = z.object({
  name: z.string().describe('The name of the new company.'),
});
export type CreateCompanyInput = z.infer<typeof CreateCompanyInputSchema>;

const CreateCompanyOutputSchema = z.object({
  companyId: z.string(),
});
export type CreateCompanyOutput = z.infer<typeof CreateCompanyOutputSchema>;

export async function createCompany(input: CreateCompanyInput, auth?: FlowAuth): Promise<CreateCompanyOutput> {
  return await createCompanyFlow(input, auth);
}

const createCompanyFlow = ai.defineFlow(
  {
    name: 'createCompanyFlow',
    inputSchema: CreateCompanyInputSchema,
    outputSchema: CreateCompanyOutputSchema,
    authPolicy: (auth, input) => {
      if (!auth) {
        throw new Error('Authentication is required to create a company.');
      }
    },
  },
  async ({name}, {auth}) => {
    if (!auth) throw new Error('Auth context is missing.');

    // Caller becomes owner of this company if not already part of one
    const caller = await authAdmin.getUser(auth.uid);
    const claims = caller.customClaims || {};
    // Allow SUPER_ADMIN to create companies without restriction
    if (claims.role !== 'SUPER_ADMIN' && claims.companyId) {
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

    // Assign owner claims to caller unless they are a SUPER_ADMIN
    if (claims.role !== 'SUPER_ADMIN') {
      await authAdmin.setCustomUserClaims(auth.uid, {role: 'admin', companyId});
      await authAdmin.revokeRefreshTokens(auth.uid);
    }

    return {companyId};
  }
);
