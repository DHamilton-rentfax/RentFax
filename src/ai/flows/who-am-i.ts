'use server';
/**
 * @fileOverview A Genkit flow to introspect the claims of the currently authenticated user.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {FlowAuth} from 'genkit/flow';
import { authAdmin } from '@/lib/firebase-admin';

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
    const user = await authAdmin.getUser(uid);
    return {
      uid,
      email: user.email,
      claims: user.customClaims || {},
    };
  }
);
