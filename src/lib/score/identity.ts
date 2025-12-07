export function identityIntegrityScore(identity: any) {
  let score = 0;

  if (identity.level === 3) score += 90;
  else if (identity.level === 2) score += 60;
  else if (identity.level === 1) score += 30;

  if (identity.authenticity > 80) score += 40;
  if (identity.shadowRisk > 60) score -= 60;

  return score;
}
