"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase/client";
import {
  collection,
  getDocs,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { CSVLink } from "react-csv";

export function AlertPanel() {
  const [alerts, setAlerts] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, "alerts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setAlerts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="border rounded-lg bg-white p-3 shadow-sm">
      <h3 className="font-semibold text-slate-900 mb-2">
        Fraud & Partner Alerts
      </h3>
      {alerts.length === 0 && (
        <p className="text-slate-500 text-sm">No alerts</p>
      )}
      <ul className="space-y-2 max-h-80 overflow-y-auto">
        {alerts.map((a) => (
          <li key={a.id} className="text-sm">
            <span className="font-medium">{a.type}</span> — {a.message}
            <span className="block text-xs text-gray-500">
              {new Date(a.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RiskDashboard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "high" | "medium" | "low">(
    "all",
  );

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, "riskProfiles"), orderBy("score", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProfiles(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = profiles.filter((p) => {
    if (filter === "high") return p.score < 50;
    if (filter === "medium") return p.score >= 50 && p.score < 80;
    if (filter === "low") return p.score >= 80;
    return true;
  });

  const csvData = filtered.map((p) => ({
    renterId: p.renterId,
    score: p.score,
    signalsCount: p.signalsCount,
    summary: p.aiSummary,
    updatedAt: p.updatedAt,
  }));

  if (loading) return <div className="p-10 text-lg">Loading risk data...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800">
              AI Risk Dashboard
            </h1>
            <CSVLink
              data={csvData}
              filename={`RentFAX_Risk_Export_${new Date().toISOString()}.csv`}
              className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
            >
              Export CSV
            </CSVLink>
          </div>

          <div className="flex gap-2">
            {["all", "high", "medium", "low"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded ${
                  filter === f
                    ? "bg-slate-800 text-white"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "high"
                    ? "High Risk"
                    : f === "medium"
                      ? "Medium"
                      : "Low Risk"}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                className={`border rounded-lg p-4 shadow-sm ${
                  p.score < 50
                    ? "border-red-400 bg-red-50"
                    : p.score < 80
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-green-400 bg-green-50"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-slate-900">{p.renterId}</h2>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      p.score < 50
                        ? "bg-red-600 text-white"
                        : p.score < 80
                          ? "bg-yellow-600 text-white"
                          : "bg-green-600 text-white"
                    }`}
                  >
                    Score: {p.score}
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-2">
                  Signals: {p.signalsCount} | Updated:{" "}
                  {new Date(p.updatedAt).toLocaleDateString()}
                </p>

                <p className="text-sm text-slate-800 whitespace-pre-line mb-3">
                  {p.aiSummary}
                </p>

                <div className="flex justify-end mt-2">
                  <Link
                    href={`/admin/risk-network/${p.renterId}`}
                    className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium px-3 py-1 rounded-md"
                  >
                    View Network
                  </Link>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <p className="text-slate-500 text-center py-10">
                No profiles match this filter.
              </p>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <AlertPanel />
        </div>
      </div>
    </div>
  );
}
