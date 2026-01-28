"use server";

import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function createLead(data: any) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const ref = await adminDb.collection("crm_leads").add({
    ...data,
    stage: "NEW",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await adminDb
    .collection("crm_leads")
    .doc(ref.id)
    .collection("activities")
    .add({
      type: "CREATED",
      text: "Lead created",
      at: FieldValue.serverTimestamp(),
    });

  return { id: ref.id };
}
