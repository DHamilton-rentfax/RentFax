export function computeFraudScore({
  rejectedChecks,
  duplicateLicenses,
  conflictCount,
  fraudIncidents,
}: any) {
  let score = 0;

  // Rejected verifications (max 20)
  score += Math.min(rejectedChecks * 10, 20);

  // Duplicate license hash (max 20)
  score += Math.min(duplicateLicenses * 10, 20);

  // Conflicting data (max 30)
  score += Math.min(conflictCount * 5, 30);

  // Fraud-related incidents (max 30)
  score += Math.min(fraudIncidents * 10, 30);

  return Math.min(score, 100);
}