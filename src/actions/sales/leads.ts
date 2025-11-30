"use server";

import { adminDB as db } from "@/firebase/server";
import { collection, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function createLead(data: any) {
  const ref = doc(collection(db, "leads"));
  await setDoc(ref, {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: ref.id };
}

export async function updateLead(id: string, data: any) {
  const ref = doc(db, "leads", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });

  return { success: true };
}
