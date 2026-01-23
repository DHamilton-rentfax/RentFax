"use server";

import { adminDb } from "@/firebase/server";
import { generateEmbeddings } from "./generateEmbeddings";
import { cosineSimilarity } from "./utils/cosineSimilarity";

export async function runFraudEngine(renterId: string) {
  const renterRef = adminDb.collection("renters").doc(renterId);
  const renter = (await renterRef.get()).data();

  if (!renter) return null;

  const fraudSignals = [];

  // 1) Duplicate Email
  const dupEmailSnap = await adminDb
    .collection("renters")
    .where("email", "==", renter.email)
    .get();

  if (dupEmailSnap.size > 1) {
    fraudSignals.push({
      type: "duplicate_email",
      confidence: 0.95,
      explanation: "Email used by multiple renter accounts.",
    });
  }

  // 2) Duplicate Phone
  const dupPhoneSnap = await adminDb
    .collection("renters")
    .where("phone", "==", renter.phone)
    .get();

  if (dupPhoneSnap.size > 1) {
    fraudSignals.push({
      type: "duplicate_phone",
      confidence: 0.85,
      explanation: "Phone number appears in multiple profiles.",
    });
  }

  // 3) Identity similarity check
  const targetEmbedding = renter.embedding ?? [];

  const allRentersSnap = await adminDb.collection("renters").get();

  for (const doc of allRentersSnap.docs) {
    const r = doc.data();
    if (doc.id === renterId) continue;

    const score = cosineSimilarity(targetEmbedding, r.embedding ?? []);
    if (score > 0.90) {
      fraudSignals.push({
        type: "identity_similarity",
        confidence: score,
        explanation: `Profile is ${Math.round(
          score * 100
        )}% similar to renter ${doc.id}.`,
      });
    }
  }

  // Compute overall score
  const score = Math.min(100, fraudSignals.length * 15);

  const summaryRef = adminDb
    .collection("renters")
    .doc(renterId)
    .collection("fraud_signals")
    .doc("summary");

  await summaryRef.set(
    {
      score,
      alert: score > 50,
      signals: fraudSignals,
      updatedAt: new Date(),
    },
    { merge: true }
  );

  return { score, fraudSignals };
}
