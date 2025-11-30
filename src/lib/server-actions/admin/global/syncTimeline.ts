"use server";

import { adminDB } from "@/firebase/server";

export async function syncTimeline(renterId: string) {
  const incidentsSnap = await adminDB
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const timelineRef = adminDB
    .collection("renters")
    .doc(renterId)
    .collection("timeline");

  // clear old timeline
  const old = await timelineRef.get();
  await Promise.all(old.docs.map((d) => d.ref.delete()));

  // rebuild
  for (const doc of incidentsSnap.docs) {
    const inc = doc.data();
    await timelineRef.add({
      type: "incident",
      incidentId: doc.id,
      companyId: inc.companyId,
      occurredAt: inc.occurredAt,
      createdAt: new Date(),
    });
  }

  return true;
}
