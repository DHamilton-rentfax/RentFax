"use client";
import { useEffect, useState } from "react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const url = `/api/audit-logs?limit=100${filter ? `&action=${filter}` : ""}`;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch audit logs');
        }
        const data = await res.json();
        setLogs(data.logs || []);
      } catch (error) {
        console.error(error);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [filter]);

  const exportCSV = () => {
    const csv = [
      ["Action", "Actor", "Details", "Timestamp", "Dispute ID"].join(","),
      ...logs.map(
        (l) =>
          [
            l.action,
            l.actor,
            `"${l.details}"`,
            l.timestamp ? new Date(l.timestamp._seconds * 1000).toISOString() : '',
            l.disputeId,
          ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-center mt-10">Loading logs...</p>;

  const filtered = logs.filter(
    (l) =>
      !search ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
      (l.action && l.action.toLowerCase().includes(search.toLowerCase())) ||
      (l.actor && l.actor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white rounded-xl p-8 shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export CSV
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Actions</option>
          <option value="DISPUTE_CREATED">Created</option>
          <option value="STATUS_UPDATED">Status Updated</option>
          <option value="AI_SUMMARY_GENERATED">AI Summary</option>
          <option value="EMAIL_SENT">Notification</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Actor</th>
              <th className="px-4 py-2 text-left">Details</th>
              <th className="px-4 py-2 text-left">Dispute ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {log.timestamp ? new Date(log.timestamp._seconds * 1000).toLocaleString() : ''}
                </td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{log.actor}</td>
                <td className="px-4 py-2">{log.details}</td>
                <td className="px-4 py-2 font-mono">{log.disputeId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
