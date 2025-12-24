
import { adminDb } from "@/lib/firebase/admin";
import { FraudSignal, FraudSignalPayload } from "@/types/fraud-signal";
import { RiskIdentifier } from "@/types/risk-identifier";
import { admin } from "@/lib/firebase/admin";

/**
 * Generates fraud signals for a given renter.
 * This is the core of the fraud signal engine.
 */
export async function generateFraudSignals(renterId: string): Promise<FraudSignalPayload> {
  const signals: FraudSignal[] = [];
  let totalScore = 0;

  // 1. Check for multiple renters at the same address
  const addressIdentifiers = await adminDb
    .collection("risk_identifiers")
    .where("linkedRenters", "array-contains", renterId)
    .where("type", "==", "ADDRESS")
    .get();

  for (const doc of addressIdentifiers.docs) {
    const riskId = doc.data() as RiskIdentifier;
    if (riskId.linkedRenters.length > 2) {
      const signal: FraudSignal = {
        type: "MULTIPLE_RENTERS_SAME_ADDRESS",
        weight: 3,
        description: `Multiple renters (${riskId.linkedRenters.length}) are associated with the same address.`,
        evidenceIds: riskId.linkedRenters,
      };
      signals.push(signal);
      totalScore += signal.weight;
    }
  }

  // 2. Check for repeated dispute failures
  const incidents = await adminDb
    .collection("incidents")
    .where("renterId", "==", renterId)
    .where("disputeOutcome", "==", "DENIED")
    .get();

  if (incidents.size > 2) {
    const signal: FraudSignal = {
      type: "REPEATED_DISPUTE_FAILURES",
      weight: 2,
      description: `Renter has a history of ${incidents.size} failed disputes.`,
      evidenceIds: incidents.docs.map((d) => d.id),
    };
    signals.push(signal);
    totalScore += signal.weight;
  }

  // 3. Check for device reuse
  const deviceIdentifiers = await adminDb
    .collection("risk_identifiers")
    .where("linkedRenters", "array-contains", renterId)
    .where("type", "==", "DEVICE")
    .get();

  for (const doc of deviceIdentifiers.docs) {
    const riskId = doc.data() as RiskIdentifier;
    if (riskId.linkedRenters.length > 1) {
      const signal: FraudSignal = {
        type: "DEVICE_REUSE",
        weight: 4,
        description: `The same device has been used by ${riskId.linkedRenters.length} different renters.`,
        evidenceIds: riskId.linkedRenters,
      };
      signals.push(signal);
      totalScore += signal.weight;
      break; // Only add this signal once per renter
    }
  }

  // Determine risk level
  let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
  if (totalScore >= 8) {
    riskLevel = "HIGH";
  } else if (totalScore >= 5) {
    riskLevel = "MEDIUM";
  }

  const payload: FraudSignalPayload = {
    renterId,
    signals,
    totalScore,
    riskLevel,
    generatedAt: admin.firestore.Timestamp.now(),
  };

  // Store the generated signals
  await adminDb.collection("fraud_signals").doc(renterId).set(payload);

  return payload;
}
