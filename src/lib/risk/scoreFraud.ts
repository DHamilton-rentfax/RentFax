
export function scoreFraud(fraudSignals = []) {
  if (!fraudSignals.length) {
    return { score: 0, reasons: ["No fraud signals detected"] };
  }

  let score = fraudSignals.length * 10;
  const reasons = fraudSignals.map((s) => s.message);

  return {
    type: "fraud",
    score: Math.min(40, score),
    reasons,
  };
}
