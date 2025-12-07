
type Decision =
  | "VERIFIED"
  | "REVIEW_REQUIRED"
  | "REJECTED";

export interface VerificationDecision {
  outcome: Decision;
  reasons: string[];
  riskScoreImpact: number;
}

export function determineVerificationOutcome({
  frontData,
  backData,
  faceMatchScore,
  liveness,
  shadowGraph,
  fraudSignals
}: any): VerificationDecision {

  const reasons: string[] = [];

  // Basic fail states
  if (!liveness) reasons.push("Liveness test failed");
  if (faceMatchScore < 0.55) reasons.push("Face mismatch - too low");

  // ID consistency checks
  if (frontData.name !== backData.name)
    reasons.push("Front/Back ID name mismatch");

  if (frontData.dob !== backData.dob)
    reasons.push("DOB mismatch between ID sides");

  // Shadow identity risk
  if (shadowGraph.dlHash?.count > 1)
    reasons.push("Driver License Hash appears in multiple renter profiles");

  // Fraud signals from engine
  if (fraudSignals.length > 0)
    reasons.push(...fraudSignals);

  // Decision Logic
  if (reasons.length === 0 && faceMatchScore >= 0.80 && liveness) {
    return { 
      outcome: "VERIFIED", 
      reasons: [], 
      riskScoreImpact: -5 
    };
  }

  if (faceMatchScore < 0.40 || !liveness) {
    return {
      outcome: "REJECTED",
      reasons,
      riskScoreImpact: +25
    };
  }

  return {
    outcome: "REVIEW_REQUIRED",
    reasons,
    riskScoreImpact: +5
  };
}
