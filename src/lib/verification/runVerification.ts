import { evaluateFaceMatch } from "./steps/faceMatch";
import { evaluateOcrConsistency } from "./steps/ocr";
import { evaluatePublicRecords } from "./steps/publicRecords";
import { scoreFraud } from "@/lib/fraudEngine/scoreFraud";

export async function buildIdentityRiskScore({
  faceMatchScore,
  ocr,
  publicData,
  renter,
  identity,
}) {
  const face = evaluateFaceMatch(faceMatchScore);
  const ocrCheck = evaluateOcrConsistency(ocr, renter);
  const pub = evaluatePublicRecords(publicData, renter);
  const fraud = await scoreFraud(renter.id, identity);

  // Weighted
  const final =
    face.score * 0.5 + ocrCheck.score * 0.2 + pub.score * 0.1 + (100 - fraud.fraudScore) * 0.2;

  return {
    finalScore: Math.round(final),
    components: {
      face,
      ocrCheck,
      pub,
      fraud,
    },
    verified: final > 75 && fraud.fraudScore < 50,
  };
}