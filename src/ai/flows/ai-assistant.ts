'use server';
/**
 * @fileOverview AI assistant flows for explaining risk and summarizing incidents.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { FlowAuth } from 'genkit/flow';
import { admin, dbAdmin as db, authAdmin } from '@/lib/firebase-admin';
import { formatDistanceToNow } from 'date-fns';

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
  explanation: z.string().describe("A 2-3 sentence summary of the renter's risk profile, mentioning score changes and key incident types."),
  recommendation: z.string().describe("A brief, actionable recommendation for the rental agent (e.g., 'Request additional deposit')."),
  confidence: z.enum(['Low', 'Medium', 'High']).describe("The AI's confidence level in its assessment."),
});
export type RiskExplainOutput = z.infer<typeof RiskExplainOutputSchema>;

const riskExplainPrompt = ai.definePrompt({
    name: 'riskExplainPrompt',
    input: { schema: z.any() },
    output: { schema: RiskExplainOutputSchema },
    prompt: `You are a concise risk analyst for a rental company.
Analyze the renter's profile to generate a summary, a recommendation, and a confidence level.
- The summary should state if the score improved or dropped and why, mentioning key incidents. (2-3 sentences).
- The recommendation should be a short, actionable next step for the agent.
- Confidence is based on the amount and severity of available data.

Renter Info:
- Name: {{{name}}}
- Current Score: {{{currentScore}}}
- Previous Score: {{{previousScore}}}

Recent Incidents (last 30 days):
{{#if incidents}}
{{#each incidents}}
- A "{{this.severity}}" {{this.type}} incident {{this.created}}.
{{/each}}
{{else}}
- None
{{/if}}`,
    config: {
        temperature: 0.4,
    }
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
    
    // Find previous score from audit logs
    const auditSnap = await db.collection('auditLogs')
      .where('companyId', '==', companyId)
      .where('targetPath', '==', `renters/${renterId}`)
      .where('action', '==', 'recomputeRenterScore')
      .orderBy('at', 'desc').limit(1).get();
      
    const previousScore = auditSnap.empty ? renterData.riskScore : auditSnap.docs[0].data().before?.riskScore;
    const currentScore = renterData.riskScore;

    const incidentsSnap = await db.collection('incidents')
      .where('companyId', '==', companyId)
      .where('renterId', '==', renterId)
      .orderBy('createdAt', 'desc').limit(10).get();
    
    const recentIncidents = incidentsSnap.docs
        .map(d => {
            const data = d.data();
            return { type: data.type, severity: data.severity, created: data.createdAt?.toDate?.() };
        })
        .filter(inc => {
            if (!inc.created) return false;
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return inc.created > thirtyDaysAgo;
        }).map(inc => ({...inc, created: formatDistanceToNow(inc.created, { addSuffix: true })}));

    const { output } = await riskExplainPrompt({
        name: renterData.name,
        currentScore,
        previousScore,
        incidents: recentIncidents,
    });
    
    return output!;
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
