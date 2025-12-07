import { adminDb } from "@/firebase/server";
import { v4 as uuid } from "uuid";
import { createNotification } from "@/lib/notifications/create";

export async function addTimelineEvent(event: any) {
  const id = uuid();
  const payload = {
    id,
    createdAt: new Date().toISOString(),
    ...event,
  };

  await adminDb.collection("renterTimeline").doc(id).set(payload);

  // Send notifications
  if (event.userId || event.companyId) {
    await createNotification({
      userId: event.userId || null,
      companyId: event.companyId || null,
      renterId: event.renterId,
      type: event.type,
      title: event.label,
      message: event.description,
      actionUrl: `/dashboard/renters/${event.renterId}`,
    });
  }

  return id;
}
