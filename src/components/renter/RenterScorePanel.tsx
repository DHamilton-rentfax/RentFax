"use client";

import React from "react";
import ScoreCard from "@/components/risk/ScoreCard";

interface RenterScorePanelProps {
  identityScore: number;
  behaviorScore: number;
  confidenceScore: number;
}

export default function RenterScorePanel({
  identityScore,
  behaviorScore,
  confidenceScore,
}: RenterScorePanelProps) {
  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-5">

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Your Renter Scores</h2>
        <p className="text-sm text-gray-600">
          Scores are provided to help build trust with landlords and rental companies.
        </p>
      </div>

      {/* SCORE GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard
          label="Identity Score"
          score={identityScore}
          color="#2563EB"
        />
        <ScoreCard
          label="Behavior Score"
          score={behaviorScore}
          color="#16A34A"
        />
        <ScoreCard
          label="Confidence Score"
          score={confidenceScore}
          color="#D97706"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="text-[11px] text-gray-500 leading-relaxed">
        These evaluation scores help property managers understand rental behavior,
        identity validity, and system confidence. Scores range from 0–100 during the
        beta phase and will expand to a more advanced scoring model soon.
      </div>
    </div>
  );
}
