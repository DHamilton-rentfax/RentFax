type Props = {
  summary: {
    summaryText: string;
    bulletPoints: string[];
    riskSignals: string[];
    version: string;
    model: string;
  };
};

export default function AISummaryPanel({ summary }: Props) {
  return (
    <section className="border rounded-xl p-6 bg-slate-50 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          AI-Generated Rental Summary
        </h3>
        <span className="text-xs text-gray-500">
          {summary.model} · {summary.version}
        </span>
      </div>

      <p className="text-sm text-gray-800 leading-relaxed">
        {summary.summaryText}
      </p>

      {summary.bulletPoints?.length > 0 && (
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {summary.bulletPoints.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}

      {summary.riskSignals?.length > 0 && (
        <div className="pt-3 border-t">
          <p className="text-xs font-semibold text-gray-600 mb-1">
            Identified Risk Signals
          </p>
          <ul className="list-disc pl-5 text-xs text-gray-600">
            {summary.riskSignals.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-[11px] text-gray-500 pt-3 border-t">
        This summary is generated from verified rental records and does not include
        opinions, assumptions, or protected characteristics.
      </p>
    </section>
  );
}
