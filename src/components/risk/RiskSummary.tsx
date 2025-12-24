
import { FraudSignalPayload } from "@/types/fraud-signal";

export function RiskSummary({ risk }: { risk: FraudSignalPayload }) {
  if (!risk || risk.riskLevel === "LOW") return null;

  return (
    <div className="border-l-4 border-yellow-500 bg-yellow-50 p-4">
      <h4 className="font-semibold">Risk Signals Detected</h4>

      <p className="text-sm text-gray-700 mt-1">
        This report includes patterns that may require additional review.
      </p>

      <ul className="mt-3 text-sm space-y-1">
        {risk.signals.map((s, i) => (
          <li key={i}>• {s.description}</li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-gray-500">
        Risk signals are informational and should be considered alongside
        verified evidence and renter explanations.
      </p>
    </div>
  );
}
