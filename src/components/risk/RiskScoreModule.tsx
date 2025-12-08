"use client";

import ScoreCard from "./ScoreCard";

interface RiskScoreModuleProps {
  identity: number;
  behavior: number;
  confidence: number;
}

export default function RiskScoreModule({
  identity,
  behavior,
  confidence,
}: RiskScoreModuleProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm space-y-4">

      <p className="text-sm font-semibold text-gray-700">
        Renter Evaluation Scores
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard
          label="Identity Score"
          score={identity}
          color="#2563EB"
        />
        <ScoreCard
          label="Behavior Score"
          score={behavior}
          color="#16A34A"
        />
        <ScoreCard
          label="Confidence Score"
          score={confidence}
          color="#D97706"
        />
      </div>

      <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
        These scores reflect identity integrity, historical behavioral patterns,
        and system confidence. Values range from 0–100 (beta mode). Future scoring
        will support 300–900 renter scoring via admin feature toggle.
      </p>
    </div>
  );
}
