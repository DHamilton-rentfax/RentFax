"use client";

import ScoreArc from "./ScoreArc";

export default function ScoreCard({
  label,
  score,
  color,
}: {
  label: string;
  score: number;
  color: string;
}) {
  return (
    <div className="border rounded-lg p-3 bg-white shadow-sm flex flex-col items-center">
      <ScoreArc label={label} score={score} color={color} />
    </div>
  );
}
