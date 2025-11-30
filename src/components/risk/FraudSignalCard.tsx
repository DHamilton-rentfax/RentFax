"use client";

import React from "react";

export default function FraudSignalCard({
  signal,
}: {
  signal: {
    code: string;
    label: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    details?: string;
  };
}) {
  const severityColor =
    signal.severity === "HIGH"
      ? "text-red-600 bg-red-50 border-red-200"
      : signal.severity === "MEDIUM"
      ? "text-yellow-700 bg-yellow-50 border-yellow-200"
      : "text-green-700 bg-green-50 border-green-200";

  return (
    <div
      className={`p-4 border rounded-lg shadow-sm ${severityColor}`}
    >
      <div className="font-semibold text-sm uppercase tracking-wide">
        {signal.label}
      </div>

      {signal.details && (
        <p className="mt-1 text-sm text-gray-700">{signal.details}</p>
      )}
    </div>
  );
}
