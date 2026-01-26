"use server";
/**
 * @fileOverview A Genkit flow for logging audit trails.
 */
import { z } from "genkit";

import { ai } from "@/ai/genkit";
import { admin, adminDb as db } from "@/firebase/server";

const AuditLogSchema = z.object({
  actorUid: z.string(),
  actorRole: z.string().optional(),
  companyId: z.string(),
  action: z.string(),
  targetPath: z.string(),
  before: z.any().optional(),
  after: z.any().optional(),
});
export type AuditLog = z.infer<typeof AuditLogSchema>;

export async function logAudit(params: AuditLog) {
  return await auditFlow(params);
}

const auditFlow = ai.defineFlow(
  {
    name: "auditFlow",
    inputSchema: AuditLogSchema,
    outputSchema: z.void(),
  },
  async (params) => {
    await db.collection("auditLogs").add({
      ...params,
      at: admin.firestore.FieldValue.serverTimestamp(),
    });
  },
);
