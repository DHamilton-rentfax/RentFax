import { doc, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function markAsRead(id: string) {
  try {
    await updateDoc(doc(db, "notifications", id), { read: true });
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
}
