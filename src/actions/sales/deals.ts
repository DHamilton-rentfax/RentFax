"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";
import { logActivity } from "./activities";

export async function createDeal(data: any) {
  const ref = adminDb.collection("deals").doc();
  await ref.set({
    ...data,
    stage: "new",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    lastActivityAt: FieldValue.serverTimestamp(),
  });

  await logActivity({
    type: "deal_created",
    dealId: ref.id,
    summary: `Deal created for ${data.companyName}`,
  });

  return { id: ref.id };
}

export async function updateDeal(id: string, data: any) {
  const ref = adminDb.collection("deals").doc(id);
  await ref.update({
    ...data,
    updatedAt: FieldValue.serverTimestamp(),
    lastActivityAt: FieldValue.serverTimestamp(),
  });

  return { success: true };
}

export async function updateDealStage(dealId: string, stage: string) {
  const ref = adminDb.collection("deals").doc(dealId);

  await ref.update({
    stage,
    updatedAt: FieldValue.serverTimestamp(),
    lastActivityAt: FieldValue.serverTimestamp(),
  });

  return { success: true };
}
