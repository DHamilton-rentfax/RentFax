"use server";
import { adminDb } from "@/firebase/server";

export async function logAudit(
  action: string,
  actorId: string,
  metadata: any = {},
) {
  await adminDb.collection("auditLogs").add({
    action,
    actorId,
    metadata,
    createdAt: new Date(),
  });
}
