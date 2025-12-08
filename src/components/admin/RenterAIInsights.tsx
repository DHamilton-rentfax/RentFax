"use client";

import { useEffect, useState } from "react";

export function RenterAIInsights({ renterId }: { renterId: string }) {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/superadmin/renters/${renterId}/ai-analysis`);
      const json = await res.json();
      setAnalysis(json);
      setLoading(false);
    }
    load();
  }, [renterId]);

  if (loading) {
    return (
      <div className="border rounded-xl p-6 bg-white shadow animate-pulse">
        <p className="text-gray-600 text-sm">Analyzing behavior…</p>
      </div>
    );
  }

  if (!analysis || analysis.error) {
    return (
      <div className="border rounded-xl p-6 bg-red-50 text-red-800 text-sm">
        AI analysis failed. Try again later.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6 bg-white shadow space-y-4">
      <h2 className="text-xl font-semibold">AI Behavioral Insights</h2>

      <p className="text-gray-800 text-sm leading-relaxed">{analysis.summary}</p>

      <div>
        <h3 className="font-medium text-sm text-gray-700">Positives</h3>
        <ul className="list-disc ml-5 text-sm text-green-700">
          {analysis.positives?.map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium text-sm text-gray-700">Concerns</h3>
        <ul className="list-disc ml-5 text-sm text-red-700">
          {analysis.negatives?.map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="text-sm">
          <p className="font-medium">Consistency Score</p>
          <p className="text-lg font-semibold">{analysis.consistencyScore}/100</p>
        </div>

        <div className="text-sm">
          <p className="font-medium">Trajectory</p>
          <p className="text-lg font-semibold capitalize">
            {analysis.trajectory}
          </p>
        </div>

        <div className="col-span-2">
          <p className="font-medium text-sm">Overall Classification</p>
          <p
            className={`text-lg font-bold ${
              analysis.overallClassification === "favorable"
                ? "text-green-600"
                : analysis.overallClassification === "uncertain"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {analysis.overallClassification.toUpperCase()}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-medium text-sm text-gray-700">Recommendations</h3>
        <ul className="list-disc ml-5 text-sm text-gray-700">
          {analysis.recommendations?.map((p: string, i: number) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
