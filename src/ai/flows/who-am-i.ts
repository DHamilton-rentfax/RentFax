'use server';
/**
 * @fileOverview A Genkit flow to introspect the claims of the currently authenticated user.
 * This flow is designed to be safe for unauthenticated users, returning a clear indicator.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {FlowAuth} from 'genkit/flow';
import { authAdmin } from '@/lib/firebase-admin';

const WhoAmIOutputSchema = z.object({
  uid: z.string().optional(),
  email: z.string().optional(),
  claims: z.any(),
  anonymous: z.boolean(),
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
    // This flow is now safe for unauthenticated users
  },
  async (payload, {auth}) => {
    console.log('[whoAmI] auth context:', auth);

    if (!auth) {
      return {
        anonymous: true,
        claims: {},
      };
    }
    
    try {
        const uid = auth.uid;
        const user = await authAdmin.getUser(uid);
        return {
            uid,
            email: user.email,
            claims: user.customClaims || {},
            anonymous: false,
        };
    } catch (err) {
      console.error('Error fetching user from Firebase Admin:', err);
      // Return authenticated but with empty claims if user lookup fails
      return {
        uid: auth.uid,
        claims: {},
        anonymous: false,
      };
    }
  }
);
