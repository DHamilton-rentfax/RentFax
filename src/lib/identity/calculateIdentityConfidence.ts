
import { IdentityConfidence, IdentityConfidenceLevel, IdentitySignal } from "@/types/identity-confidence";
import { adminDb, admin } from "@/lib/firebase/admin";

/**
 * Calculates the identity confidence level for a renter.
 * @param renterId The ID of the renter.
 * @param signals The signals to calculate the confidence from.
 * @returns The identity confidence object.
 */
export async function calculateIdentityConfidence(
  renterId: string,
  signals: IdentitySignal[]
): Promise<IdentityConfidence> {
  let level: IdentityConfidenceLevel = "LOW";
  const uniqueSignals = [...new Set(signals)];

  const hasId = uniqueSignals.includes("ID_VERIFIED");
  const hasSelfie = uniqueSignals.includes("SELFIE_MATCH");
  const hasEmail = uniqueSignals.includes("EMAIL_CONFIRMED");

  if (hasId && hasSelfie && hasEmail) {
    level = "HIGH";
  } else if (hasId || hasEmail) {
    level = "MEDIUM";
  }

  const confidence: IdentityConfidence = {
    renterId,
    level,
    signals: uniqueSignals,
    verifiedAt: level === "HIGH" ? admin.firestore.Timestamp.now() : undefined,
  };

  await adminDb.collection("identity_confidence").doc(renterId).set(confidence, { merge: true });

  return confidence;
}
