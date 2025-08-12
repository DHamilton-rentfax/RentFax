'use server';
/**
 * @fileOverview AI assistant flows for explaining risk and summarizing incidents.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { FlowAuth } from 'genkit/flow';
import { admin, dbAdmin as db, authAdmin } from '@/lib/firebase-admin';

// Common auth policy for assistant flows
const assistantAuthPolicy = async (auth: FlowAuth) => {
  if (!auth) throw new Error('Authentication is required.');
  const { companyId, role } = (await authAdmin.getUser(auth.uid)).customClaims || {};
  if (!companyId || !role) throw new Error('User must belong to a company with a role.');
};

// --- Risk Explain Flow ---

const RiskExplainInputSchema = z.object({
  renterId: z.string(),
});
export type RiskExplainInput = z.infer<typeof RiskExplainInputSchema>;

const RiskExplainOutputSchema = z.object({
  explanation: z.string(),
});
export type RiskExplainOutput = z.infer<typeof RiskExplainOutputSchema>;

const riskExplainPrompt = ai.definePrompt({
  name: 'riskExplainPrompt',
  input: {
    schema: z.object({
      score: z.number().nullable(),
      previousScore: z.number().optional().nullable(),
      reasons: z.array(z.any()),
      incidents: z.array(z.any()),
    }),
  },
  prompt: `You are a risk analyst for a rental platform. Be concise, neutral, and actionable.
- NEVER INVENT FACTS. Only use the provided data.
- Output at most 6 bullet points.
{{#if previousScore}}
- The user's score changed from {{{previousScore}}} to {{{score}}}. Explain this change.
{{/if}}

Renter score: {{{score}}}
Score Reasons: {{{json reasons}}}
Recent Incidents: {{{json incidents}}}

Explain the score for a non-technical agent. Include:
- A one-line summary of the current score and any recent change.
- Top risk drivers (as bullet points).
- Suggested actions for the agent (as bullet points).`,
  config: {
    temperature: 0.2,
  },
});


const riskExplainFlow = ai.defineFlow(
  {
    name: 'riskExplainFlow',
    inputSchema: RiskExplainInputSchema,
    outputSchema: RiskExplainOutputSchema,
    authPolicy: assistantAuthPolicy,
  },
  async ({ renterId }, { auth }) => {
    if (!auth) throw new Error('Auth is missing.');
    const { companyId } = auth.claims as any;

    const renterRef = db.doc(`renters/${renterId}`);
    const renterSnap = await renterRef.get();

    if (!renterSnap.exists) throw new Error('Renter not found.');
    if (renterSnap.data()?.companyId !== companyId) throw new Error('Permission denied.');

    const renterData = renterSnap.data()!;
    const incidentsSnap = await db.collection('incidents')
      .where('companyId', '==', companyId)
      .where('renterId', '==', renterId)
      .orderBy('createdAt', 'desc').limit(5).get();
    
    const incidents = incidentsSnap.docs.map(d => {
        const data = d.data();
        return {
            type: data.type,
            severity: data.severity,
            amount: data.amount || 0,
            createdAt: data.createdAt?.toDate?.()?.toISOString?.() || ''
        }
    });
    
    // Find previous score from audit logs
    const auditSnap = await db.collection('auditLogs')
      .where('companyId', '==', companyId)
      .where('targetPath', '==', `renters/${renterId}`)
      .where('action', '==', 'recomputeRenterScore')
      .orderBy('at', 'desc').limit(1).get();
      
    const previousScore = auditSnap.empty ? null : auditSnap.docs[0].data().before?.riskScore;

    const { text } = await riskExplainPrompt({
      score: renterData.riskScore ?? null,
      previousScore,
      reasons: renterData.scoreReasons ?? [],
      incidents: incidents,
    });
    
    return { explanation: text };
  }
);

export async function riskExplain(input: RiskExplainInput, auth?: FlowAuth): Promise<RiskExplainOutput> {
    return riskExplainFlow(input, auth);
}

// --- Incident Assist Flow ---

const IncidentAssistInputSchema = z.object({
  incidentId: z.string(),
  freeformNotes: z.string().optional(),
});
export type IncidentAssistInput = z.infer<typeof IncidentAssistInputSchema>;

const IncidentAssistOutputSchema = z.object({
  summary: z.string().optional(),
  checklist: z.array(z.string()).optional(),
  customerNote: z.string().optional(),
});
export type IncidentAssistOutput = z.infer<typeof IncidentAssistOutputSchema>;


const incidentAssistPrompt = ai.definePrompt({
    name: 'incidentAssistPrompt',
    input: { schema: z.any() },
    output: { schema: IncidentAssistOutputSchema },
    prompt: `You help rental agents document incidents clearly.
- Produce: (1) a concise incident summary (<=80 words), (2) a checklist of 5 items to verify, (3) a suggested customer-friendly note (<=60 words).
- Keep it neutral and policy-aligned. Do not include legal advice.

Incident: {{{json this}}}

Return JSON with keys: summary, checklist (array of 5 strings), customerNote`,
    config: {
        temperature: 0.2,
    },
});

const incidentAssistFlow = ai.defineFlow({
    name: 'incidentAssistFlow',
    inputSchema: IncidentAssistInputSchema,
    outputSchema: IncidentAssistOutputSchema,
    authPolicy: assistantAuthPolicy,
}, async ({ incidentId, freeformNotes }, { auth }) => {
    if (!auth) throw new Error('Auth is missing.');
    const { companyId } = auth.claims as any;

    const incidentRef = db.doc(`incidents/${incidentId}`);
    const incidentSnap = await incidentRef.get();

    if (!incidentSnap.exists) throw new Error('Incident not found.');
    if (incidentSnap.data()?.companyId !== companyId) throw new Error('Permission denied.');

    const incidentData = incidentSnap.data()!;
    const payload = {
        type: incidentData.type,
        severity: incidentData.severity,
        amount: incidentData.amount || 0,
        notes: incidentData.notes || '',
        freeform: freeformNotes || '',
    };

    const { output } = await incidentAssistPrompt(payload);
    return output!;
});

export async function incidentAssist(input: IncidentAssistInput, auth?: FlowAuth): Promise<IncidentAssistOutput> {
    return incidentAssistFlow(input, auth);
}
