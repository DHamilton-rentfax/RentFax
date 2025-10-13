"use server";
import { adminDB } from "@/firebase/server";

export async function logAudit(
  action: string,
  actorId: string,
  metadata: any = {},
) {
  await adminDB.collection("auditLogs").add({
    action,
    actorId,
    metadata,
    createdAt: new Date(),
  });
}
