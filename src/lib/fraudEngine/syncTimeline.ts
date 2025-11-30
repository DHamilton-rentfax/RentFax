// src/lib/fraudEngine/syncTimeline.ts
import { adminDB } from "@/firebase/server";

export async function syncTimeline(renterId: string, entry: any) {
  await adminDB
    .collection("renters")
    .doc(renterId)
    .collection("timeline")
    .add({
      ...entry,
      createdAt: Date.now(),
    });
}
