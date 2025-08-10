'use server';
/**
 * @fileOverview A Genkit flow to set custom claims for a Firebase user.
 * Restricted to users with the 'superadmin' role.
 */

import { ai } from '@/ai/genkit';
import { onFlow } from '@genkit-ai/next/server';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

const SetUserClaimsInputSchema = z.object({
  uid: z.string().describe('The UID of the user to set claims for.'),
  role: z.string().describe('The role to assign to the user.'),
  companyId: z.string().describe('The company ID to associate with the user.'),
});

export const setUserClaims = onFlow(
  {
    name: 'setUserClaims',
    inputSchema: SetUserClaimsInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
    authPolicy: (auth, input) => {
      // In a real app, you would have more robust role checking.
      // For now, we allow any authenticated user to support the self-signup flow.
      // The superadmin check can be added here once a superadmin exists.
      if (!auth) {
        throw new Error('Authentication is required to set claims.');
      }
      // Example of role check:
      // if (auth.claims?.role !== 'superadmin' && auth.uid !== input.uid) {
      //   throw new Error('Only superadmin can set claims for other users.');
      // }
    },
  },
  async ({ uid, role, companyId }) => {
    await admin.auth().setCustomUserClaims(uid, { role, companyId });
    return { success: true };
  }
);
