"use client";

type FraudSignal = {
  type?: string;         // e.g. "DUPLICATE_EMAIL"
  severity?: "LOW" | "MEDIUM" | "HIGH";
  description?: string;
  firstDetected?: any;
};

function severityColor(sev?: string) {
  switch (sev) {
    case "HIGH":
      return "bg-red-100 text-red-700";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";
    case "LOW":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function FraudSummary({ signals }: { signals: FraudSignal[] }) {
  if (!signals || signals.length === 0) {
    return (
      <div className="bg-white border rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-2">Fraud Signals</h2>
        <p className="text-sm text-gray-600">
          No fraud signals detected for this renter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-2xl shadow p-8 space-y-4">
      <h2 className="text-2xl font-semibold">Fraud Signals</h2>
      <p className="text-sm text-gray-600">
        The following potential risk indicators were detected. These do not
        guarantee fraud, but they may require additional review.
      </p>

      <ul className="space-y-3">
        {signals.map((s, idx) => (
          <li key={idx} className="border rounded-xl p-3 text-sm flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {s.type || "Signal"}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${severityColor(s.severity)}`}>
                {s.severity || "UNKNOWN"}
              </span>
            </div>
            {s.description && (
              <p className="text-gray-600">{s.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
