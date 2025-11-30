"use client";

type Factors = {
  incidents?: number;
  disputes?: number;
  fraudSignals?: number;
  verified?: boolean;
  aiRiskScore?: number;
  profileCompleted?: boolean;
};

export default function ScoreFactors({ factors }: { factors: Factors }) {
  if (!factors) return null;

  const positive: string[] = [];
  const negative: string[] = [];

  if (factors.verified) positive.push("Verified identity");
  if (factors.profileCompleted) positive.push("Completed profile");
  if ((factors.incidents ?? 0) === 0) positive.push("No incidents on file");
  if ((factors.disputes ?? 0) === 0) positive.push("No disputes on record");

  if ((factors.incidents ?? 0) > 0)
    negative.push(`${factors.incidents} incident(s) reported`);
  if ((factors.disputes ?? 0) > 0)
    negative.push(`${factors.disputes} dispute(s) on record`);
  if ((factors.fraudSignals ?? 0) > 0)
    negative.push(`${factors.fraudSignals} fraud signal(s) detected`);

  return (
    <div className="bg-white border rounded-2xl shadow p-8 space-y-6">
      <h2 className="text-2xl font-semibold">Score Factors</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Positive */}
        <div>
          <h3 className="font-semibold mb-2 text-green-700">Positive Signals</h3>
          {positive.length === 0 ? (
            <p className="text-sm text-gray-500">
              No significant positive factors recorded yet.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {positive.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 text-green-600">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Negative */}
        <div>
          <h3 className="font-semibold mb-2 text-red-700">Risk Factors</h3>
          {negative.length === 0 ? (
            <p className="text-sm text-gray-500">
              No major risk factors detected.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {negative.map((n, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 text-red-600">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {typeof factors.aiRiskScore === "number" && (
        <p className="text-xs text-gray-500">
          AI risk score (0–100) used in scoring: {factors.aiRiskScore}
        </p>
      )}
    </div>
  );
}
