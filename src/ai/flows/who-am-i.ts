'use server';
/**
 * @fileOverview A Genkit flow to introspect the claims of the currently authenticated user.
 */

import { ai } from '@/ai/genkit';
import { onFlow } from '@genkit-ai/flow/experimental';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const whoAmI = onFlow(
  {
    name: 'whoAmI',
    inputSchema: z.void(),
    outputSchema: z.object({
      uid: z.string(),
      email: z.string().optional(),
      claims: z.any(),
    }),
    authPolicy: (auth, input) => {
      if (!auth) {
        throw new Error('Authentication is required.');
      }
    },
  },
  async (payload, { auth }) => {
    if (!auth) {
      throw new Error('User is not authenticated.');
    }
    const uid = auth.uid;
    const user = await admin.auth().getUser(uid);
    return {
      uid,
      email: user.email,
      claims: user.customClaims || {},
    };
  }
);
