"use client";

import { useEffect, useState } from "react";

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchReports = async () => {
    const token = await window.firebase.auth().currentUser.getIdToken();
    const res = await fetch("/api/reports", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setReports(data.reports || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const generateReport = async () => {
    setGenerating(true);
    const token = await window.firebase.auth().currentUser.getIdToken();
    const res = await fetch("/api/reports/generate", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setGenerating(false);
    if (data.success) {
      alert("Report generated successfully!");
      fetchReports(); // refresh list
    } else {
      alert("Error generating report: " + data.error);
    }
  };

  if (loading) return <p className="p-6">Loading reports…</p>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📑 Investor Report History</h1>
        <button
          onClick={generateReport}
          disabled={generating}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {generating ? "Generating..." : "Generate Report Now"}
        </button>
      </div>

      {reports.length === 0 ? (
        <p>No reports available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((r) => (
            <div
              key={r.id}
              className="bg-white shadow rounded-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {new Date(r.period).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <p className="text-sm text-gray-600">
                  Revenue: ${r.revenue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Events: {r.events}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Generated {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
              <a
                onClick={async (e) => {
                  e.preventDefault();
                  const token = await window.firebase
                    .auth()
                    .currentUser.getIdToken();
                  const res = await fetch(`/api/reports/download?id=${r.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await res.json();
                  if (data.url) {
                    window.open(data.url, "_blank");
                  } else {
                    alert("Download error: " + data.error);
                  }
                }}
                className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center hover:bg-indigo-700"
              >
                Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
