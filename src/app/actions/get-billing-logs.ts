"use server";

import { adminDb } from "@/firebase/server";

export async function getBillingLogs({
  userId = null,
  event = null,
  limit = 100,
}: any) {
  let ref = adminDb.collection("billingLogs").orderBy("timestamp", "desc");

  if (userId) ref = ref.where("userId", "==", userId);
  if (event) ref = ref.where("event", "==", event);

  const snap = await ref.limit(limit).get();

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
