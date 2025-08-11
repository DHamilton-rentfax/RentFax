'use server';
/**
 * @fileOverview A Genkit flow to set custom claims for a Firebase user.
 * Restricted to users with 'superadmin' or 'owner' roles.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as admin from 'firebase-admin';
import {FlowAuth} from 'genkit/flow';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

type Role = 'owner' | 'manager' | 'agent' | 'collections' | 'renter' | 'superadmin';

const SetUserClaimsInputSchema = z.object({
  uid: z.string().describe('The UID of the user to set claims for.'),
  role: z.string().describe('The role to assign to the user.'),
  companyId: z.string().optional().describe('The company ID to associate with the user.'),
});
export type SetUserClaimsInput = z.infer<typeof SetUserClaimsInputSchema>;

const SetUserClaimsOutputSchema = z.object({success: z.boolean()});
export type SetUserClaimsOutput = z.infer<typeof SetUserClaimsOutputSchema>;

export async function setUserClaims(input: SetUserClaimsInput, auth?: FlowAuth): Promise<SetUserClaimsOutput> {
  return await setUserClaimsFlow(input, auth);
}

const setUserClaimsFlow = ai.defineFlow(
  {
    name: 'setUserClaimsFlow',
    inputSchema: SetUserClaimsInputSchema,
    outputSchema: z.object({success: z.boolean()}),
    authPolicy: async (auth, input) => {
      if (!auth) {
        throw new Error('Authentication is required.');
      }
      const caller = await admin.auth().getUser(auth.uid);
      const callerClaims = caller.customClaims || {};
      const callerRole = callerClaims?.role as Role | undefined;

      if (!callerRole) {
        throw new Error('Permission denied: Caller has no assigned role.');
      }
      if (!(callerRole === 'superadmin' || callerRole === 'owner')) {
        throw new Error('Permission denied: Insufficient role.');
      }

      if (callerRole === 'owner') {
        if (!input.companyId || callerClaims.companyId !== input.companyId) {
          throw new Error('Permission denied: Owners can only set claims for their own company.');
        }
        if (input.role === 'superadmin') {
          throw new Error('Permission denied: Owners cannot assign the superadmin role.');
        }
      }
    },
  },
  async ({uid, role, companyId}, {auth}) => {
    if (!auth) throw new Error('Auth context missing');

    const caller = await admin.auth().getUser(auth.uid);
    const callerClaims = caller.customClaims || {};

    // Set custom claims
    const finalCompanyId = companyId || callerClaims.companyId;
    if (!finalCompanyId) throw new Error('Company ID is required when caller is not an owner.');

    await admin.auth().setCustomUserClaims(uid, {role, companyId: finalCompanyId});
    // Force token refresh on client
    await admin.auth().revokeRefreshTokens(uid);

    return {success: true};
  }
);
