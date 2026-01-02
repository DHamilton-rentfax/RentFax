"use client";

import { convertToCreditRange } from "@/lib/risk/convertScore";
import { ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

export default function RiskPanel({ risk }) {
  if (!risk) return null;

  const riskNumeric = convertToCreditRange(risk.riskScore.score || 0);
  const confidence = risk.confidenceScore?.score || 0;

  const color =
    riskNumeric >= 750
      ? "text-green-700"
      : riskNumeric >= 600
      ? "text-yellow-700"
      : "text-red-700";

  return (
    <div className="rounded-xl border p-6 space-y-5 bg-white shadow-sm">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-gray-700" />
        Renter Risk Profile
      </h2>

      {/* Risk Score */}
      <div>
        <p className="text-xs text-gray-600 mb-1">Risk Score</p>
        <p className={`text-4xl font-bold ${color}`}>{riskNumeric}</p>
      </div>

      {/* Confidence */}
      <div>
        <p className="text-xs text-gray-600 mb-1">Confidence Score</p>
        <p className="text-xl font-semibold">{confidence}%</p>
      </div>

      {/* Breakdown */}
      <div className="pt-3 border-t">
        <p className="text-xs text-gray-500 mb-2">Score Breakdown</p>

        <ul className="space-y-1 text-sm">
          <li>Incidents Weight: {risk.riskScore.breakdown.incidents}</li>
          <li>Disputes Weight: {risk.riskScore.breakdown.disputes}</li>
          <li>Balances Weight: {risk.riskScore.breakdown.balances}</li>
          <li>Signals Weight: {risk.riskScore.breakdown.signals}</li>
        </ul>
      </div>

      {/* Signals */}
      <div className="pt-3 border-t">
        <p className="font-medium mb-2 text-sm">Signals</p>

        {risk.signals.length === 0 && (
          <p className="text-xs text-gray-500">No signals detected.</p>
        )}

        <ul className="space-y-1">
          {risk.signals.map((s, idx) => (
            <li
              key={idx}
              className={`px-2 py-1 rounded border text-xs inline-flex gap-2 items-center ${
                s.severity === "HIGH"
                  ? "text-red-700 border-red-700"
                  : s.severity === "MEDIUM"
                  ? "text-yellow-700 border-yellow-700"
                  : "text-gray-700 border-gray-700"
              }`}
            >
              {s.severity === "HIGH" ? (
                <ShieldAlert className="h-3 w-3" />
              ) : (
                <AlertTriangle className="h-3 w-3" />
              )}
              {s.type}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
