import { adminDb } from "@/firebase/server";

export async function pushIdentityTimeline(userId, event) {
  const ref = db.collection("users").doc(userId).collection("identityTimeline").doc();
  await ref.set({
    id: ref.id,
    ...event,
    createdAt: Date.now(),
  });
}
