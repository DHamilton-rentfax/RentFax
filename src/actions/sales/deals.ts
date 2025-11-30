"use server";

import { adminDB as db } from "@/firebase/server";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { logActivity } from "./activities";

export async function createDeal(data: any) {
  const ref = doc(collection(db, "deals"));
  await setDoc(ref, {
    ...data,
    stage: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  await logActivity({
    type: "deal_created",
    dealId: ref.id,
    summary: `Deal created for ${data.companyName}`,
  });

  return { id: ref.id };
}

export async function updateDeal(id: string, data: any) {
  const ref = doc(db, "deals", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  return { success: true };
}

export async function updateDealStage(dealId: string, stage: string) {
  const ref = doc(db, "deals", dealId);

  await updateDoc(ref, {
    stage,
    updatedAt: serverTimestamp(),
    lastActivityAt: serverTimestamp(),
  });

  return { success: true };
}
