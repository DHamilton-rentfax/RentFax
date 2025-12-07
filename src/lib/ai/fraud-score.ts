export function computeFraudScore(signals: string[]) {
  const base = 100;

  const weight = {
    DUPLICATE_EMAIL: 15,
    DUPLICATE_PHONE: 15,
    IDENTITY_REUSE: 30,
    LICENSE_COLLISION: 25,
    ADDRESS_VARIATION: 10,
  } as const;

  let score = 0;

  for (const s of signals) {
    score += weight[s] || 0;
  }

  return Math.min(score, base);
}
