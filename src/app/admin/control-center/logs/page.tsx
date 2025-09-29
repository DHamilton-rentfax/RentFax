"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/client";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterOrg, setFilterOrg] = useState("");
  const [filterActor, setFilterActor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduledExports, setScheduledExports] = useState<any[]>([]);
  const [cron, setCron] = useState("");
  const [emails, setEmails] = useState("");
  const [manualExportStartDate, setManualExportStartDate] = useState("");
  const [manualExportEndDate, setManualExportEndDate] = useState("");

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      const token = await auth.currentUser?.getIdToken();
      const params = new URLSearchParams();
      if (filterType) params.append("type", filterType);
      if (filterOrg) params.append("orgId", filterOrg);
      if (filterActor) params.append("actorUid", filterActor);
      if (startDate) params.append("startDate", new Date(startDate).getTime().toString());
      if (endDate) params.append("endDate", new Date(endDate).getTime().toString());

      const res = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(data.logs || []);
      setLoading(false);
    }
    fetchLogs();
  }, [filterType, filterOrg, filterActor, startDate, endDate]);

  useEffect(() => {
    async function fetchScheduledExports() {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/admin/audit-logs/schedule-export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setScheduledExports(data.scheduledExports || []);
    }
    // fetchScheduledExports();
  }, []);

  function exportCSV() {
    const header = ["Time", "Org", "Type", "Actor", "Target", "Role"];
    const rows = logs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.orgId,
      log.type,
      log.actorUid,
      log.targetEmail || log.targetUid || "",
      log.role || "",
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "audit-logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function scheduleExport() {
    const token = await auth.currentUser?.getIdToken();
    await fetch(`/api/admin/audit-logs/schedule-export`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cron, emails: emails.split(",") }),
    });
  }

  if (loading) return <p>Loading logs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Logs</h1>

      {/* Filters */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="INVITE_SENT">Invite Sent</option>
          <option value="INVITE_ACCEPTED">Invite Accepted</option>
          <option value="INVITE_RESENT">Invite Resent</option>
          <option value="INVITE_CANCELED">Invite Canceled</option>
          <option value="INVITE_EXPIRED">Invite Expired</option>
        </select>

        <input
          type="text"
          value={filterOrg}
          onChange={(e) => setFilterOrg(e.target.value)}
          placeholder="Filter by Org ID"
          className="border rounded p-2"
        />

        <input
          type="text"
          value={filterActor}
          onChange={(e) => setFilterActor(e.target.value)}
          placeholder="Filter by Actor UID"
          className="border rounded p-2"
        />

        <div className="flex gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 flex-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 flex-1"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Export CSV (Filtered)
        </button>
        <button
          onClick={async () => {
            const token = await auth.currentUser?.getIdToken();
            const params = new URLSearchParams();
            if (filterType) params.append("type", filterType);
            if (filterOrg) params.append("orgId", filterOrg);
            if (filterActor) params.append("actorUid", filterActor);
            if (startDate) params.append("startDate", new Date(startDate).getTime().toString());
            if (endDate) params.append("endDate", new Date(endDate).getTime().toString());

            const res = await fetch(`/api/admin/audit-logs/export?${params.toString()}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "audit-logs-full.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
        >
          Download All Logs
        </button>
      </div>

      {/* Logs Table */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Time</th>
            <th className="border px-3 py-2">Org</th>
            <th className="border px-3 py-2">Type</th>
            <th className="border px-3 py-2">Actor</th>
            <th className="border px-3 py-2">Target</th>
            <th className="border px-3 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border px-3 py-2">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="border px-3 py-2">{log.orgId}</td>
              <td className="border px-3 py-2">{log.type}</td>
              <td className="border px-3 py-2">{log.actorUid}</td>
              <td className="border px-3 py-2">{log.targetEmail || log.targetUid}</td>
              <td className="border px-3 py-2">{log.role || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Scheduled Exports</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            placeholder="Cron Expression (e.g., 0 0 * * 0)"
            className="border rounded p-2 flex-1"
          />
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            placeholder="Emails (comma-separated)"
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={scheduleExport}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mr-3"
          >
            Schedule Export
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
            <input
                type="date"
                value={manualExportStartDate}
                onChange={(e) => setManualExportStartDate(e.target.value)}
                className="border rounded p-2 flex-1"
            />
            <input
                type="date"
                value={manualExportEndDate}
                onChange={(e) => setManualExportEndDate(e.target.value)}
                className="border rounded p-2 flex-1"
            />
            <button
                onClick={async () => {
                const token = await auth.currentUser?.getIdToken();
                const body: { startDate?: string, endDate?: string } = {};
                if (manualExportStartDate && manualExportEndDate) {
                    body.startDate = manualExportStartDate;
                    body.endDate = manualExportEndDate;
                }
                const res = await fetch("/api/admin/audit-export-send", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });
                if (res.ok) {
                    alert("📧 Export sent to recipients!");
                } else {
                    alert("❌ Failed to send export");
                }
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
                Send Now
            </button>
        </div>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Cron Expression</th>
              <th className="border px-3 py-2">Emails</th>
              <th className="border px-3 py-2">Last Run</th>
            </tr>
          </thead>
          <tbody>
            {scheduledExports.map((export) => (
              <tr key={export.id}>
                <td className="border px-3 py-2">{export.cron}</td>
                <td className="border px-3 py-2">{export.emails.join(", ")}</td>
                <td className="border px-3 py-2">{export.lastRun ? new Date(export.lastRun).toLocaleString() : "Never"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
