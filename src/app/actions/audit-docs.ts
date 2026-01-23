"use server";

import { adminDb } from "@/firebase/server";

export async function logDocAction(
  orgId: string,
  actorUid: string,
  action: string,
  docId: string,
) {
  await adminDb.collection(`orgs/${orgId}/audit`).add({
    actorUid,
    action: `DOC_${action}`,
    target: docId,
    timestamp: Date.now(),
  });
}
