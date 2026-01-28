"use server";
import { getAdminDb } from "@/firebase/server";

export async function logAudit(
  action: string,
  actorId: string,
  metadata: any = {},
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  await adminDb.collection("auditLogs").add({
    action,
    actorId,
    metadata,
    createdAt: new Date(),
  });
}
