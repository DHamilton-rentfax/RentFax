"use server";

import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

// CREATE TASK
export async function createTask(data: any) {
  const ref = adminDb.collection("tasks").doc();
  await ref.set({
    ...data,
    status: "open",
    createdAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id };
}

// COMPLETE TASK
export async function completeTask(taskId: string) {
  const ref = adminDb.collection("tasks").doc(taskId);
  await ref.update({
    status: "completed",
    completedAt: FieldValue.serverTimestamp(),
  });
  return { success: true };
}
