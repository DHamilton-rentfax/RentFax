// src/lib/fraudEngine/syncTimeline.ts
import { adminDb } from "@/firebase/server";

export async function syncTimeline(renterId: string, entry: any) {
  await adminDb
    .collection("renters")
    .doc(renterId)
    .collection("timeline")
    .add({
      ...entry,
      createdAt: Date.now(),
    });
}
