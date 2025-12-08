// lib/risk/convertScore.ts

export type ScoreScale = "RAW" | "CREDIT";

export function convertScore(raw: number, scale: ScoreScale = "RAW") {
  if (scale === "CREDIT") {
    // convert 0–100 → 300–900
    return Math.round(300 + (raw / 100) * 600);
  }
  return Math.round(raw); // direct 0–100
}

export function scoreLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Review Suggested";
}

export function scoreColor(score: number): string {
  if (score >= 85) return "text-green-700";
  if (score >= 70) return "text-green-500";
  if (score >= 55) return "text-yellow-600";
  return "text-red-600";
}
