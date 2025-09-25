'use server';

import { adminDB } from "@/firebase/server";
import crypto from "crypto";

async function hashEntry(prevHash: string, data: object) {
  return crypto.createHash("sha256")
    .update(prevHash + JSON.stringify(data))
    .digest("hex");
}

export async function logAction(orgId: string, actorUid: string, action: string, details: object) {
  const coll = adminDB.collection(`orgs/${orgId}/audit`);
  const last = await coll.orderBy("timestamp", "desc").limit(1).get();
  const prevHash = last.empty ? "" : last.docs[0].get("hash");

  const entry = {
    actorUid,
    action,
    details,
    timestamp: Date.now(),
  };

  const hash = await hashEntry(prevHash, entry);

  await coll.add({ ...entry, hash });
}
