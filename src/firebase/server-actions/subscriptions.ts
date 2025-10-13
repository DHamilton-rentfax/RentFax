"use server";

import { adminDB } from "@/firebase/server";

export async function getSubscriptions({
  plan,
  status,
}: {
  plan: string;
  status: string;
}) {
  let query: FirebaseFirestore.Query = adminDB.collection("subscriptions");

  if (plan !== "all") {
    query = query.where("planName", "==", plan);
  }

  if (status !== "all") {
    query = query.where("status", "==", status);
  }

  const snap = await query.get();
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
