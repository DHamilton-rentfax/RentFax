import { adminDb } from "@/firebase/server";

export async function findMatchingRenter(profile: any) {
  const rentersRef = db.collection("renters");

  const q = rentersRef.where("fullName", "==", profile.fullName);

  const snap = await q.get();

  if (!snap.empty) {
    const doc = snap.docs[0].data();

    return {
      id: snap.docs[0].id,
      identityScore: 92,
      fraudScore: Math.floor(Math.random() * 20),
      publicProfile: doc,
      preMatchedReportId: doc.latestReportId || null,
    };
  }

  // NEW renter — no match found
  return {
    id: "new",
    identityScore: 40,
    fraudScore: Math.floor(Math.random() * 10),
    publicProfile: profile,
  };
}
