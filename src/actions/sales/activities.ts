"use server";

import { db } from "@/lib/firebase/server";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function logActivity(data: any) {
  const ref = doc(collection(db, "activities"));
  await setDoc(ref, {
    ...data,
    timestamp: serverTimestamp(),
  });
  return { id: ref.id };
}
