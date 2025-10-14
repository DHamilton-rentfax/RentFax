import { db } from "@/lib/firebase/admin";
import admin from "firebase-admin";

export async function createNotification({
  userId,
  title,
  message,
  type = "GENERAL",
}: {
  userId: string;
  title: string;
  message: string;
  type?: string;
}) {
  try {
    await db.collection("notifications").add({
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`📢 Notification created for user ${userId}`);
  } catch (err) {
    console.error("❌ Failed to create notification:", err);
  }
}
