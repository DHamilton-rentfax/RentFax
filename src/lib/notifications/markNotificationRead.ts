import "server-only";
import { adminDb } from "@/firebase/server";

export async function markNotificationRead(
  notificationId: string,
  renterId: string
) {
  const ref = adminDb.collection("notifications").doc(notificationId);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error("Notification not found");
  }

  if (snap.data()?.renterId !== renterId) {
    throw new Error("Unauthorized");
  }

  await ref.update({ read: true });
}
