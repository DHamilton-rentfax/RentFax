'use client';

import { useEffect, useState } from "react";

type FraudCase = {
  renterId: string;
  reportId?: string;
  fraudReason: string;
  fraudAt: any;
};

export default function FraudReviewDashboard() {
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/fraud-cases")
      .then((r) => r.json())
      .then((d) => {
        setCases(d.cases || []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading fraud cases…</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Fraud Review Queue</h1>

      {cases.length === 0 && (
        <p className="text-sm text-gray-500">No active fraud cases.</p>
      )}

      {cases.map((c) => (
        <div
          key={c.renterId}
          className="border rounded-lg p-4 bg-white shadow-sm space-y-2"
        >
          <p className="text-sm font-medium">
            Renter ID: <span className="font-mono">{c.renterId}</span>
          </p>

          <p className="text-xs text-red-600 font-semibold">
            {c.fraudReason}
          </p>

          {c.reportId && (
            <a
              href={`/report/${c.reportId}`}
              className="text-xs text-blue-600 underline"
            >
              View Related Report
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
