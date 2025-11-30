
import { scoreIdentityMatch } from "./scoreIdentityMatch";
import { scoreFraud } from "./scoreFraud";
import { scorePublicRecords } from "./scorePublicRecords";

export async function runRiskEngine({ internal, publicRecords, fraudSignals, input }) {
  const identity = scoreIdentityMatch({ internal, publicRecords, input });
  const fraud = scoreFraud(fraudSignals);
  const publicScore = scorePublicRecords(publicRecords);

  const finalScore = Math.round(
    identity.score * 0.5 +
    publicScore * 0.3 +
    fraud.score * 0.2
  );

  return {
    score: finalScore,
    identity,
    fraud,
    publicRecordRisk: publicScore,
    level:
      finalScore >= 80 ? "HIGH_RISK" :
      finalScore >= 40 ? "REVIEW" : "SAFE",
  };
}
