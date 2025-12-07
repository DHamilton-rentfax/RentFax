export function computeVerificationConfidenceV4(results: any) {
  let score = 0;

  if (results.authenticityScore > 70) score += 30;
  if (results.faceMatch.similarity > 0.75) score += 25;
  if (results.liveness === true) score += 15;
  if (results.hologramPresent) score += 10;
  if (results.mrzValid) score += 10;
  if (results.address.country !== "UNKNOWN") score += 5;
  if (results.shadowIdentityConfidence > 50) score += 5;

  return Math.min(score, 100);
}
