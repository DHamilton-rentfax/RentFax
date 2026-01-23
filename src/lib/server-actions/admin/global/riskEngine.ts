"use server";

import { adminDb } from "@/firebase/server";

export async function calculateRiskScore(renterId: string) {
  const renter = (
    await adminDb.collection("renters").doc(renterId).get()
  ).data();

  if (!renter) return null;

  const fraudSummary = await adminDb
    .collection("renters")
    .doc(renterId)
    .collection("fraud_signals")
    .doc("summary")
    .get();

  const fraudScore = fraudSummary.exists ? fraudSummary.data()!.score : 0;

  // Count incidents
  const incidentSnap = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .get();

  const totalIncidents = incidentSnap.size;

  // Calculate severity index
  let severitySum = 0;
  incidentSnap.forEach((doc) => {
    const incident = doc.data();
    severitySum += Math.min(incident.amount / 100, 20); // Cap 20 points
  });

  const combinedScore = Math.min(
    100,
    fraudScore * 0.6 + totalIncidents * 5 + severitySum * 2
  );

  await adminDb.collection("renters").doc(renterId).set(
    {
      riskScore: combinedScore,
      totalIncidents,
    },
    { merge: true }
  );

  return combinedScore;
}
