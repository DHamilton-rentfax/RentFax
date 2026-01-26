"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function updateRepCommission(
  repId: string,
  data: {
    rate?: number;
    overrides?: {
      enterprise?: number;
      [key: string]: any;
    };
    [key: string]: any;
  },
) {
  if (!repId) {
    throw new Error("repId is required");
  }

  await adminDb
    .collection("rep_commission")
    .doc(repId)
    .set(
      {
        ...data,
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

  return { success: true };
}
