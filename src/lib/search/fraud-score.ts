export function computeFraudScore({ enriched }: any) {
  let score = 0;

  if (enriched?.fraudSignals?.email_disposable) score += 25;
  if (enriched?.fraudSignals?.phone_voip) score += 20;

  // Add more signals later…
  return Math.min(100, score);
}