import { adminDb } from "@/firebase/server";

export async function createNotification(renterId: string, data: any) {
  await db
    .collection("renters")
    .doc(renterId)
    .collection("notifications")
    .add({
      ...data,
      read: false,
      createdAt: new Date(),
    });
}
