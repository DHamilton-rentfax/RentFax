import { adminDb } from "../firebase/server";

export async function checkTimeline(matches: any[]) {
  for (const m of matches) {
    const timelineSnap = await adminDb
      .collection("renters")
      .doc(m.id)
      .collection("timeline")
      .limit(1)
      .get();

    if (!timelineSnap.empty) {
      return { exists: true, renterId: m.id };
    }
  }
  return { exists: false };
}