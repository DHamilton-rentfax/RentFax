"use client";

import { Gauge } from "lucide-react";

export function IdentityScoreBreakdown({
  confidenceScore,
  matchScore,
  fraudScore,
}: {
  confidenceScore: number; // Overall confidence (0-100)
  matchScore: number; // Internal match score (0-100)
  fraudScore: number; // Fraud score (0-100)
}) {
  return (
    <div className="border rounded-lg p-4 bg-white space-y-2">
      <div className="flex items-center gap-2 font-semibold text-slate-800">
        <Gauge className="w-4 h-4" />
        Identity Score Breakdown
      </div>

      <div className="text-sm text-slate-600">
        <strong>Identity Confidence:</strong>{" "}
        <span className="font-medium">{confidenceScore}%</span>
      </div>

      <div className="text-sm text-slate-600">
        <strong>Match Score:</strong>{" "}
        <span className="font-medium">{matchScore}/100</span>
      </div>

      <div className="text-sm text-slate-600">
        <strong>Fraud Score:</strong>{" "}
        <span className="font-medium">{fraudScore}/100</span>
      </div>
    </div>
  );
}
