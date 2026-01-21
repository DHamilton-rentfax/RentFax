import "server-only";
import { adminDb } from "@/firebase/server";
import { NotificationType } from "@/types/notification";

type CreateNotificationParams = {
  renterId: string;
  companyId: string;
  companyName: string;
  type: NotificationType;
  metadata?: Record<string, any>;
  dedupeWindowMs?: number; // optional
};

export async function createNotification({
  renterId,
  companyId,
  companyName,
  type,
  metadata = {},
  dedupeWindowMs = 5 * 60 * 1000, // 5 minutes default
}: CreateNotificationParams) {
  const now = Date.now();
  const since = now - dedupeWindowMs;

  const recent = await adminDb
    .collection("notifications")
    .where("renterId", "==", renterId)
    .where("companyId", "==", companyId)
    .where("type", "==", type)
    .where("createdAt", ">", since)
    .limit(1)
    .get();

  if (!recent.empty) return; // prevent spam

  await adminDb.collection("notifications").add({
    renterId,
    companyId,
    companyName,
    type,
    metadata,
    read: false,
    createdAt: now,
  });
}
