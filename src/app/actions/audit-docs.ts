'use server';

import { adminDB } from "@/firebase/server";

export async function logDocAction(orgId: string, actorUid: string, action: string, docId: string) {
  await adminDB.collection(`orgs/${orgId}/audit`).add({
    actorUid,
    action: `DOC_${action}`,
    target: docId,
    timestamp: Date.now(),
  });
}
