"use server";

import { getAdminDb } from "@/firebase/server";

export async function getBillingLogs({
  userId = null,
  event = null,
  limit = 100,
}: any) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }
  let ref = adminDb.collection("billingLogs").orderBy("timestamp", "desc");

  if (userId) ref = ref.where("userId", "==", userId);
  if (event) ref = ref.where("event", "==", event);

  const snap = await ref.limit(limit).get();

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
