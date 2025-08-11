'use server';
/**
 * @fileOverview A Genkit flow for logging audit trails.
 */
import { onFlow } from '@genkit-ai/next/server';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

const AuditLogSchema = z.object({
    actorUid: z.string(),
    actorRole: z.string().optional(),
    companyId: z.string(),
    targetPath: z.string(),
    action: z.string(),
    before: z.any().optional(),
    after: z.any().optional(),
});

export const logAudit = onFlow(
  {
    name: 'logAudit',
    inputSchema: AuditLogSchema,
    outputSchema: z.void(),
    authPolicy: (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
    }
  },
  async (params) => {
    await db.collection('auditLogs').add({
      ...params,
      at: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);
