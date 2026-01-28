"use server";

import { getAdminDb } from "@/firebase/server";

export async function getSubscriptions({
  plan,
  status,
}: {
  plan: string;
  status: string;
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  let query: FirebaseFirestore.Query = adminDb.collection("subscriptions");

  if (plan !== "all") {
    query = query.where("planName", "==", plan);
  }

  if (status !== "all") {
    query = query.where("status", "==", status);
  }

  const snap = await query.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
