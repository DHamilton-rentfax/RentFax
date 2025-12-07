export function paymentScore(history: any[]) {
  let score = 900;

  const late = history.filter((p) => p.status === "LATE").length;
  const missed = history.filter((p) => p.status === "MISSED").length;
  const nsf = history.filter((p) => p.status === "NSF").length;

  score -= late * 10;
  score -= missed * 25;
  score -= nsf * 40;

  return Math.max(300, score);
}
