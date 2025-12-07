export function computeHousingPaymentScore(history: any[]) {
  const latePayments = history.filter((p) => p.status === "LATE").length;
  const missed = history.filter((p) => p.status === "MISSED").length;

  let score = 100;

  score -= latePayments * 5;
  score -= missed * 15;

  return Math.max(0, score);
}
