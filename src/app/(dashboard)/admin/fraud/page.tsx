"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function FraudDashboard() {
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState([]);

  useEffect(() => {
    fetch("/api/admin/fraud/list")
      .then((res) => res.json())
      .then((json) => {
        setChecks(json.items || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-10 py-8">
      <h1 className="text-3xl font-semibold">Fraud Signals</h1>
      <p className="text-gray-600 mt-1">
        Review high-risk renters detected by the AI engine.
      </p>

      {loading && (
        <div className="flex items-center gap-2 mt-10">
          <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
          Loading…
        </div>
      )}

      {!loading && (
        <div className="mt-8 space-y-4">
          {checks.map((c: any) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 bg-white shadow flex justify-between"
            >
              <div>
                <p className="font-semibold">{c.renter?.fullName}</p>
                <p className="text-sm text-gray-600">
                  Fraud Score: <b>{c.fraudScore}</b>
                </p>
                <p className="text-xs text-gray-500">
                  Signals: {c.fraudSignals.join(", ")}
                </p>
              </div>

              <button className="text-sm underline text-gray-900">
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
