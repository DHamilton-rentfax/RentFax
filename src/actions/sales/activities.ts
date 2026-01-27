"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function logActivity(data: any) {
  const ref = adminDb.collection("activities").doc();
  await ref.set({
    ...data,
    timestamp: FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
}
