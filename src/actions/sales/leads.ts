"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function createLead(data: any) {
  const ref = adminDb.collection("leads").doc();
  await ref.set({
    ...data,
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { id: ref.id };
}

export async function updateLead(id: string, data: any) {
  const ref = adminDb.collection("leads").doc(id);
  await ref.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
  });

  return { success: true };
}
