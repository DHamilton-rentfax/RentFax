"use server";

import { getAdminDb } from "@/firebase/server";

export async function logDocAction(
  orgId: string,
  actorUid: string,
  action: string,
  docId: string,
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  await adminDb.collection(`orgs/${orgId}/audit`).add({
    actorUid,
    action: `DOC_${action}`,
    target: docId,
    timestamp: Date.now(),
  });
}
