
"use server";

import { db } from "@/lib/firebase/server";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export async function updateRepCommission(repId: string, data: any) {
  const ref = doc(db, "rep_commission", repId);
  await setDoc(ref, { 
    ...data, 
    updatedAt: serverTimestamp() 
  });
  return { success: true };
}

export async function removeRepCommissionOverride(repId: string) {
  const ref = doc(db, "rep_commission", repId);
  await deleteDoc(ref);
  return { success: true };
}
