
import { adminDb } from "@/firebase/server";

// Example simple scoring (we can expand later)
export async function recomputeFraudScore(renterId: string) {
  const renterSnap = await adminDb.collection("renters").doc(renterId).get();
  const renter = renterSnap.data();

  if (!renter) return;

  let fraudScore = renter.fraudScore ?? 0;

  // Verified → lower fraud score
  if (renter.verificationStatus === "verified") fraudScore = Math.max(10, fraudScore - 20);

  // Partial verification → small reduction
  if (renter.verificationStatus === "partial") fraudScore = Math.max(20, fraudScore - 10);

  // Unverified → increase score
  if (renter.verificationStatus === "unverified")
    fraudScore = Math.min(90, fraudScore + 10);

  // Save updated score
  await renterSnap.ref.update({
    fraudScore,
    fraudScoreUpdatedAt: Date.now(),
  });

  // Update all connected full reports
  const reports = await adminDb
    .collection("reports")
    .where("renterId", "==", renterId)
    .get();

  const batch = adminDb.batch();

  reports.forEach((doc) => {
    batch.update(doc.ref, {
      fraudScore,
      verificationStatus: renter.verificationStatus,
    });
  });

  await batch.commit();
}
