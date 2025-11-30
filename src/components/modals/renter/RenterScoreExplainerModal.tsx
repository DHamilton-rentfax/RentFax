"use client";

import { Button } from "@/components/ui/button";

interface RenterScoreExplainerModalProps {
  score: number;
  close: () => void;
}

export default function RenterScoreExplainerModal({
  score,
  close,
}: RenterScoreExplainerModalProps) {
  const clamped = Math.max(0, Math.min(100, score));

  const tier =
    clamped >= 85
      ? "Excellent"
      : clamped >= 70
      ? "Strong"
      : clamped >= 50
      ? "Fair"
      : clamped >= 30
      ? "Watchlist"
      : "High Risk";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Your Reputation Score</h2>

      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-blue-700">{clamped}</span>
        <span className="text-sm uppercase tracking-wide text-gray-500">
          / 100 – {tier}
        </span>
      </div>

      <p className="text-sm text-gray-600">
        The RentFAX reputation score summarizes your rental history across
        property, vehicles, and equipment. It factors in on-time payments,
        disputes, verified incidents, and fraud signals.
      </p>

      <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
        <li>Positive history and resolved disputes improve your score.</li>
        <li>Serious unpaid incidents or proven fraud decrease it.</li>
        <li>
          Uploading evidence and resolving open balances can help recover your
          score over time.
        </li>
      </ul>

      <p className="text-xs text-gray-500">
        Landlords and partners see a simplified version of this score, never
        your private account details.
      </p>

      <div className="flex justify-end pt-2">
        <Button variant="outline" onClick={close}>
          Close
        </Button>
      </div>
    </div>
  );
}