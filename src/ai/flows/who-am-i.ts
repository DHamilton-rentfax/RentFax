'use server';
/**
 * @fileOverview A Genkit flow to introspect the claims of the currently authenticated user.
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

const WhoAmIOutputSchema = z.object({
  uid: z.string(),
  email: z.string().optional(),
  claims: z.any(),
});
export type WhoAmIOutput = z.infer<typeof WhoAmIOutputSchema>;

export async function whoAmI(auth?: FlowAuth): Promise<WhoAmIOutput> {
  return await whoAmIFlow(undefined, auth);
}

const whoAmIFlow = ai.defineFlow(
  {
    name: 'whoAmIFlow',
    inputSchema: z.void(),
    outputSchema: WhoAmIOutputSchema,
    authPolicy: (auth, input) => {
      if (!auth) {
        throw new Error('Authentication is required.');
      }
    },
  },
  async (payload, {auth}) => {
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
