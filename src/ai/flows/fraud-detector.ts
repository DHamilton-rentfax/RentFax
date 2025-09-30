'use server';
/**
 * @fileOverview A Genkit flow for detecting potential fraud and risk signals.
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
  code: z.enum(['duplicateIdentity', 'sharedAddressRisk', 'repeatOffender']),
  identifier: z.string(),
  value: z.string(),
  matches: z.array(MatchSchema).optional(),
  details: z.string().optional(),
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
      if (!['owner', 'manager', 'agent'].includes(role)) throw new Error('Permission denied.');
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
    
    // 1. Duplicate Identity Check
    const identityFields = ['email', 'phone', 'licenseNumber'].filter(f => !!renter[f]);
    for (const field of identityFields) {
        const value = renter[field];
        if (!value) continue;

        const q = db.collection('renters').where(field, '==', value);
        const results = await q.get();

        if (results.size > 1) {
            const matches = results.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as any))
                .filter(doc => doc.id !== renterId); 

            if (matches.length > 0) {
                 signals.push({
                    code: 'duplicateIdentity',
                    identifier: field,
                    value: value,
                    matches: matches.map(m => ({ id: m.id, name: m.name, companyId: m.companyId })),
                });
            }
        }
    }

    // 2. Repeat Offender Check
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentIncidentsSnap = await db.collection('incidents')
        .where('renterId', '==', renterId)
        .where('createdAt', '>=', thirtyDaysAgo)
        .get();

    if (recentIncidentsSnap.size >= 3) {
        signals.push({
            code: 'repeatOffender',
            identifier: 'recentIncidents',
            value: `${recentIncidentsSnap.size}`,
            details: `Renter has had ${recentIncidentsSnap.size} incidents in the last 30 days.`
        });
    }
    
    // Store the results in a separate collection for the dashboard to query.
    await db.doc(`fraud_signals/${renterId}`).set({
        renterId,
        signals,
        evaluatedAt: new Date(),
    }, { merge: true });

    return { signals };
  }
);
