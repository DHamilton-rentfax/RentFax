import { adminDb } from "@/firebase/server";
import { v4 as uuid } from "uuid";

export async function createNotification(payload: any) {
  const id = uuid();
  await adminDb.collection("notifications").doc(id).set({
    id,
    read: false,
    createdAt: new Date().toISOString(),
    ...payload,
  });
  return id;
}
