import { collection, addDoc } from "firebase/firestore";

import { db } from "@/firebase/client";

export async function logNotification(data: any) {
  await addDoc(collection(db, "notifications"), {
    ...data,
    createdAt: new Date().toISOString(),
  });
}
