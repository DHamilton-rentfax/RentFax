// lib/risk/computeRiskScore.ts

import { detectSignals } from "./detectSignals";

export interface RiskScoreResult {
  score: number;
  signals: ReturnType<typeof detectSignals>;
}

export function computeRiskScore(input: {
  renter: any;
  incidents: any[];
  disputes: any[];
}): RiskScoreResult {
  const signals = detectSignals(input);

  // Start from 100 and subtract weights
  let score = 100;
  for (const s of signals) score -= s.weight;

  // Clamp
  score = Math.max(0, Math.min(100, score));

  return { score, signals };
}
