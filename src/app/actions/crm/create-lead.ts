"use server";

import { adminDB } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function createLead(data: any) {
  const ref = await adminDB.collection("crm_leads").add({
    ...data,
    stage: "NEW",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  await adminDB
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
