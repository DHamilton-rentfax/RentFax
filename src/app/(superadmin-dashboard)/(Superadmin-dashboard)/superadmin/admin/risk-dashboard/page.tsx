"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, Users, Search, Loader2, MapPin } from "lucide-react";

export default function RiskDashboard() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "HIGH" | "MEDIUM">("ALL");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/risk-dashboard", { cache: "no-store" });
      const json = await res.json();
      setRows(json.items || []);
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    filter === "ALL"
      ? rows
      : rows.filter((r) => r.riskLevel === filter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Risk Intelligence Dashboard</h1>
      <p className="text-sm text-gray-600">
        View the highest-risk renters, unresolved incidents, and identity anomalies.
      </p>

      {/* FILTERS */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            filter === "ALL" ? "bg-gray-900 text-white" : "bg-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("HIGH")}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            filter === "HIGH" ? "bg-red-600 text-white" : "bg-white"
          }`}
        >
          High Risk
        </button>
        <button
          onClick={() => setFilter("MEDIUM")}
          className={`px-3 py-1.5 rounded-full text-sm border ${
            filter === "MEDIUM" ? "bg-yellow-500 text-white" : "bg-white"
          }`}
        >
          Moderate Risk
        </button>
      </div>

      {/* TABLE */}
      <div className="border rounded-xl overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3">Renter</th>
              <th className="text-left p-3">Risk Score</th>
              <th className="text-left p-3">Confidence</th>
              <th className="text-left p-3">Signals</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.renterId} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">{r.fullName}</div>
                    <div className="text-xs text-gray-600">{r.email}</div>
                  </td>

                  <td className="p-3 font-semibold">
                    {r.riskScore} / 900
                  </td>

                  <td className="p-3">{r.confidenceScore}%</td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {r.signals.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 rounded-full text-[10px] border ${
                            s.severity === "HIGH"
                              ? "text-red-700 border-red-700"
                              : s.severity === "MEDIUM"
                              ? "text-yellow-700 border-yellow-700"
                              : "text-gray-700 border-gray-700"
                          }`}
                        >
                          {s.type}
                        </span>
                      ))}
                      {r.signals.length > 3 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] border text-black">
                          +{r.signals.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-3">
                    <a
                      href={`/admin/renter/${r.renterId}`}
                      className="text-blue-600 underline text-xs"
                    >
                      View Profile
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
