"use client";

import React from "react";

// Pure SVG / CSS premium gauge
// score: 1–100
// level: "LOW" | "MEDIUM" | "HIGH"

export default function RiskGauge({
  score,
  level,
}: {
  score: number;
  level: "LOW" | "MEDIUM" | "HIGH";
}) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;

  const levelColor =
    level === "HIGH"
      ? "#DC2626" // red-600
      : level === "MEDIUM"
      ? "#D97706" // yellow-600
      : "#059669"; // green-600

  return (
    <div className="flex flex-col items-center">
      <svg width="180" height="180" className="overflow-visible">
        {/* Background circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth="10"
          fill="none"
        />

        {/* Gold progress circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          stroke="#D4A017"
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform="rotate(-90 90 90)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />

        {/* Score text */}
        <text
          x="90"
          y="80"
          textAnchor="middle"
          fontSize="40"
          fontWeight="700"
          fill={levelColor}
        >
          {score}
        </text>

        {/* Level label */}
        <text
          x="90"
          y="115"
          textAnchor="middle"
          fontSize="16"
          fontWeight="600"
          fill={levelColor}
        >
          {level}
        </text>
      </svg>

      <p className="mt-3 text-sm text-gray-500 tracking-wide">
        RentFAX Risk Score
      </p>
    </div>
  );
}
