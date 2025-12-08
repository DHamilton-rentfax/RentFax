import { adminDb } from "@/firebase/server";

export async function createNotification(userId: string, data: any) {
  const ref = adminDb
    .collection("users")
    .doc(userId)
    .collection("notifications")
    .doc();

  await ref.set({
    ...data,
    createdAt: new Date(),
    read: false,
  });

  return ref.id;
}
