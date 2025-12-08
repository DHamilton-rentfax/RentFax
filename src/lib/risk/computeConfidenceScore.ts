// lib/risk/computeConfidenceScore.ts

export interface ConfidenceScoreResult {
  score: number;
  factors: string[];
}

export function computeConfidenceScore(input: {
  verifiedFields: number;
  totalFields: number;
  crossMatches: number;
}): ConfidenceScoreResult {
  const factors: string[] = [];
  const { verifiedFields, totalFields, crossMatches } = input;

  let score = 0;

  if (totalFields > 0) {
    const coverage = verifiedFields / totalFields;
    score += coverage * 70;
    factors.push(`Verified ${verifiedFields}/${totalFields} fields`);
  }

  score += Math.min(30, crossMatches * 10);
  if (crossMatches > 0) factors.push(`Matched ${crossMatches} external sources`);

  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, factors };
}
