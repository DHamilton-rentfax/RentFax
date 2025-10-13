"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type GlobalStats = {
  totalOrgs: number;
  totalRenters: number;
  totalDisputes: number;
  fraudFlags: number;
  events: any[];
  revenue: any;
  engagement: {
    totals: {
      previewed: number;
      downloaded: number;
    };
    timeline: {
      date: string;
      previewed: number;
      downloaded: number;
    }[];
    byOrg: {
      orgId: string;
      orgName: string;
      previewed: number;
      downloaded: number;
    }[];
  };
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
    "data:text/csv;charset=utf-8," + rows.map((r) => r.join(",")).join("\n");

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
      100 + idx * 8,
    );
  });

  doc.save("rentfax_analytics.pdf");
}

export default function SuperDashboard() {
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null);
  const [orgTimeline, setOrgTimeline] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/global-stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  async function viewOrg(org: any) {
    const token = await window.firebase.auth().currentUser.getIdToken();
    const res = await fetch(`/api/revenue/org-engagement?orgId=${org.orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.timeline) {
      setSelectedOrg(org);
      setOrgTimeline(data.timeline);
    }
  }

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
        <div className="p-4 border rounded shadow">
          <h3>Orgs</h3>
          <p>{stats.totalOrgs}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3>Renters</h3>
          <p>{stats.totalRenters}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3>Disputes</h3>
          <p>{stats.totalDisputes}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3>Fraud Flags</h3>
          <p>{stats.fraudFlags}</p>
        </div>
      </div>

      {/* Reports Engagement */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          📑 Reports Engagement (30d)
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-indigo-600">
              {stats.engagement?.totals.previewed || 0}
            </p>
            <p className="text-gray-600 text-sm">Reports Previewed</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-3xl font-bold text-green-600">
              {stats.engagement?.totals.downloaded || 0}
            </p>
            <p className="text-gray-600 text-sm">Reports Downloaded</p>
          </div>
        </div>

        {stats?.engagement?.timeline?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.engagement.timeline}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="previewed" fill="#6366f1" name="Previewed" />
              <Bar dataKey="downloaded" fill="#10b981" name="Downloaded" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No engagement data available yet.</p>
        )}
      </div>

      {/* Engagement by Org */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          🏢 Report Engagement by Organization
        </h2>
        {stats?.engagement?.byOrg?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-medium">
                  <th className="px-4 py-2">Organization</th>
                  <th className="px-4 py-2">Reports Previewed</th>
                  <th className="px-4 py-2">Reports Downloaded</th>
                </tr>
              </thead>
              <tbody>
                {stats.engagement.byOrg.map((org: any) => (
                  <tr
                    key={org.orgId}
                    className="border-t text-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => viewOrg(org)}
                  >
                    <td className="px-4 py-2">{org.orgName}</td>
                    <td className="px-4 py-2 text-indigo-600 font-semibold">
                      {org.previewed}
                    </td>
                    <td className="px-4 py-2 text-green-600 font-semibold">
                      {org.downloaded}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No org engagement data yet.</p>
        )}
      </div>

      {/* Org Drill-Down Modal */}
      {selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
            <button
              onClick={() => setSelectedOrg(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">
              📊 Engagement Timeline – {selectedOrg.orgName}
            </h2>
            {orgTimeline.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={orgTimeline}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="previewed" fill="#6366f1" name="Previewed" />
                  <Bar dataKey="downloaded" fill="#10b981" name="Downloaded" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No timeline data available for this org.</p>
            )}

            {/* Export Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={async () => {
                  const token = await window.firebase
                    .auth()
                    .currentUser.getIdToken();
                  const res = await fetch(
                    `/api/revenue/org-engagement/export?orgId=${selectedOrg.orgId}&format=csv`,
                    { headers: { Authorization: `Bearer ${token}` } },
                  );
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `org_${selectedOrg.orgId}_engagement.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Export CSV
              </button>

              <button
                onClick={async () => {
                  const token = await window.firebase
                    .auth()
                    .currentUser.getIdToken();
                  const res = await fetch(
                    `/api/revenue/org-engagement/export?orgId=${selectedOrg.orgId}&format=pdf`,
                    { headers: { Authorization: `Bearer ${token}` } },
                  );
                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `org_${selectedOrg.orgId}_engagement.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Export PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
