'use server';
/**
 * @fileOverview A Genkit flow for detecting potential fraud signals.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { FlowAuth } from 'genkit/flow';
import { dbAdmin as db, authAdmin } from '@/lib/firebase-admin';

const DetectFraudSignalsInputSchema = z.object({
  renterId: z.string(),
});
export type DetectFraudSignalsInput = z.infer<typeof DetectFraudSignalsInputSchema>;

const MatchSchema = z.object({
    id: z.string(),
    name: z.string(),
    companyId: z.string(),
});

const FraudSignalSchema = z.object({
  identifier: z.string(),
  value: z.string(),
  matches: z.array(MatchSchema),
});
export type FraudSignal = z.infer<typeof FraudSignalSchema>;

const DetectFraudSignalsOutputSchema = z.object({
    signals: z.array(FraudSignalSchema),
});
export type DetectFraudSignalsOutput = z.infer<typeof DetectFraudSignalsOutputSchema>;

export async function detectFraudSignals(input: DetectFraudSignalsInput, auth?: FlowAuth): Promise<DetectFraudSignalsOutput> {
  return await detectFraudSignalsFlow(input, auth);
}

const detectFraudSignalsFlow = ai.defineFlow(
  {
    name: 'detectFraudSignalsFlow',
    inputSchema: DetectFraudSignalsInputSchema,
    outputSchema: DetectFraudSignalsOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error('Authentication is required.');
      const { role } = (await authAdmin.getUser(auth.uid)).customClaims || {};
      if (!['owner', 'manager'].includes(role)) throw new Error('Permission denied.');
    },
  },
  async ({ renterId }, { auth }) => {
    const { companyId } = auth!.claims as any;

    const renterRef = db.doc(`renters/${renterId}`);
    const renterSnap = await renterRef.get();
    if (!renterSnap.exists || renterSnap.data()?.companyId !== companyId) {
      throw new Error('Renter not found or permission denied.');
    }

    const renter = renterSnap.data()!;
    const signals: FraudSignal[] = [];
    const fieldsToTest = ['email', 'phone', 'licenseNumber'].filter(f => !!renter[f]);

    for (const field of fieldsToTest) {
        const value = renter[field];
        if (!value) continue;

        const q = db.collection('renters').where(field, '==', value);
        const results = await q.get();

        if (results.size > 1) {
            const matches = results.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as any))
                .filter(doc => doc.id !== renterId); // Exclude the source renter

            if (matches.length > 0) {
                 signals.push({
                    identifier: field,
                    value: value,
                    matches: matches.map(m => ({ id: m.id, name: m.name, companyId: m.companyId })),
                });
            }
        }
    }
    
    return { signals };
  }
);
