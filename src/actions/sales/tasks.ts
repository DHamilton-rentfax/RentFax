"use server";

import { db } from "@/lib/firebase/server";
import { collection, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";

// CREATE TASK
export async function createTask(data: any) {
  const ref = doc(collection(db, "tasks"));
  await setDoc(ref, {
    ...data,
    status: "open",
    createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

// COMPLETE TASK
export async function completeTask(taskId: string) {
  const ref = doc(db, "tasks", taskId);
  await updateDoc(ref, {
    status: "completed",
    completedAt: serverTimestamp(),
  });
  return { success: true };
}
