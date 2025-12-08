"use client";

import React from "react";

interface ScoreArcProps {
  label: string;
  score: number; // 0–100 now, future: 300–900 auto-scaled
  color?: string;
}

export default function ScoreArc({ label, score, color }: ScoreArcProps) {
  const normalized = Math.min(100, Math.max(0, score)); // clamp 0–100
  const angle = (normalized / 100) * 180;

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="relative h-28 w-56 overflow-hidden">
        <svg
          viewBox="0 0 100 50"
          className="w-full h-full"
          style={{ overflow: "visible" }}
        >
          {/* Background arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="none"
          />

          {/* Score arc */}
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            stroke={color ?? "#111"}
            strokeWidth="8"
            fill="none"
            strokeDasharray="126"
            strokeDashoffset={126 - (126 * normalized) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <p className="text-2xl font-bold" style={{ color }}>
            {normalized}
          </p>
        </div>
      </div>

      {/* Label */}
      <p className="text-xs mt-1 text-gray-600 font-medium">{label}</p>
    </div>
  );
}
