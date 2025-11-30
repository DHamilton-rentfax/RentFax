
"use server";

import { db } from "@/lib/firebase/server";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function updateGlobalCommissionSettings(data: any) {
  const ref = doc(db, "commission_settings", "global");
  await setDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
  return { success: true };
}
