"use client";

import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import type { RentalOutcome, PerformanceSignal } from "@/types/rental-record";

export type RentalHistoryItem = {
  id: string;
  outcome: RentalOutcome;
  signals: PerformanceSignal[];
  context: {
    rentalType: string;
    rentalDuration: string;
    paymentFrequency: string;
  };
  scoreSnapshot: {
    fri: number;
    riskLevel: "LOW" | "MODERATE" | "HIGH" | "SEVERE";
  };
  createdAt: string;
  orgName?: string;
};

interface Props {
  items: RentalHistoryItem[];
}

function outcomeMeta(outcome: RentalOutcome) {
  switch (outcome) {
    case "COMPLETED_NO_ISSUES":
      return {
        label: "Completed • No Issues",
        icon: CheckCircle,
        color: "text-green-600",
      };
    case "COMPLETED_MINOR_ISSUES":
      return {
        label: "Completed • Minor Issues",
        icon: AlertTriangle,
        color: "text-yellow-600",
      };
    case "COMPLETED_MAJOR_ISSUES":
    case "DENIED_OR_NOT_COMPLETED":
      return {
        label: "Issue / Denied",
        icon: XCircle,
        color: "text-red-600",
      };
  }
}

export default function RentalHistoryTimeline({ items }: Props) {
  if (!items.length) {
    return (
      <div className="text-sm text-gray-500 py-6">
        No rental history yet. This renter’s record will build over time.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const meta = outcomeMeta(item.outcome);
        const Icon = meta.icon;

        return (
          <div
            key={item.id}
            className="rounded-lg border p-4 space-y-2 bg-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${meta.color}`}>
                <Icon className="h-5 w-5" />
                <span className="font-semibold text-sm">{meta.label}</span>
              </div>

              <span className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Signals */}
            {item.signals.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {item.signals.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 rounded bg-gray-100 text-gray-700"
                  >
                    {s.replace(/_/g, " ").toLowerCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Context + Score */}
            <div className="flex flex-wrap justify-between text-xs text-gray-600 pt-1">
              <span>
                {item.context.rentalType} · {item.context.rentalDuration}
              </span>
              <span>
                Risk at time:{" "}
                <strong>{item.scoreSnapshot.riskLevel}</strong> (
                {item.scoreSnapshot.fri})
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
