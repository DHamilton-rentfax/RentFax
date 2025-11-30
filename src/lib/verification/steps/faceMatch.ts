export function evaluateFaceMatch(score: number) {
  if (score >= 92) {
    return {
      score,
      tier: "PASS_STRONG",
      risk: "low",
      message: "Strong selfie-to-ID match",
    };
  }

  if (score >= 82) {
    return {
      score,
      tier: "PASS_WEAK",
      risk: "medium",
      message: "Selfie matches ID but not strongly",
    };
  }

  if (score >= 70) {
    return {
      score,
      tier: "REVIEW_REQUIRED",
      risk: "high",
      message: "Identity match uncertain — manual review recommended",
    };
  }

  return {
    score,
    tier: "FAIL",
    risk: "critical",
    message: "Selfie does NOT match ID — potential fraud",
  };
}