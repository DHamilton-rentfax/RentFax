
"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

type GlobalStats = {
  totalOrgs: number;
  totalRenters: number;
  totalDisputes: number;
  fraudFlags: number;
  events: any[];
  revenue: any;
};

function exportCSV(events: any[], revenue: any) {
  const rows = [
    ["Metric", "Value"],
    ["MRR", revenue.mrr],
    ["ARR", revenue.arr],
    ["Active Subs", revenue.activeSubs],
    ["Churn Rate", revenue.churnRate + "%"],
    ["---", "---"],
    ["Event ID", "Event Name", "Props", "Timestamp"],
  ];

  events.forEach((e) => {
    rows.push([
      e.id,
      e.event,
      JSON.stringify(e.props),
      new Date(e.ts).toISOString(),
    ]);
  });

  const csvContent =
    "data:text/csv;charset=utf-8," +
    rows.map((r) => r.join(",")).join("
");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "rentfax_analytics.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function exportPDF(events: any[], revenue: any) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("RentFAX Analytics Report", 14, 20);

  doc.setFontSize(12);
  doc.text(`MRR: $${revenue.mrr}`, 14, 40);
  doc.text(`ARR: $${revenue.arr}`, 14, 50);
  doc.text(`Active Subs: ${revenue.activeSubs}`, 14, 60);
  doc.text(`Churn Rate: ${revenue.churnRate}%`, 14, 70);

  doc.text("Recent Events:", 14, 90);

  events.slice(0, 20).forEach((e, idx) => {
    doc.text(
      `${idx + 1}. ${e.event} – ${new Date(e.ts).toLocaleString()}`,
      14,
      100 + idx * 8
    );
  });

  doc.save("rentfax_analytics.pdf");
}

export default function SuperDashboard() {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/global-stats")
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Super Admin Analytics</h1>
        <div className="flex gap-3">
          <button
            onClick={() => exportCSV(stats.events, stats.revenue)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportPDF(stats.events, stats.revenue)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Export PDF
          </button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-4">
        <div className="p-4 border rounded shadow"><h3>Orgs</h3><p>{stats.totalOrgs}</p></div>
        <div className="p-4 border rounded shadow"><h3>Renters</h3><p>{stats.totalRenters}</p></div>
        <div className="p-4 border rounded shadow"><h3>Disputes</h3><p>{stats.totalDisputes}</p></div>
        <div className="p-4 border rounded shadow"><h3>Fraud Flags</h3><p>{stats.fraudFlags}</p></div>
      </div>
  </div>
  );
}
