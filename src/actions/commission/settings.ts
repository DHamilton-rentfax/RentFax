"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function updateGlobalCommissionSettings(data: any) {
  await adminDb
    .collection("commission_settings")
    .doc("global")
    .set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return { success: true };
}
