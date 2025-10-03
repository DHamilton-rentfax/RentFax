
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function exportCSV(logs: any[]) {
  const headers = ["Action", "Target", "Changed By", "Details", "Timestamp"];
  const rows = logs.map((log) => [
    log.action,
    log.targetUser || log.targetDispute || log.targetIncident || log.targetBlog || "",
    log.changedBy,
    log.oldValue && log.newValue ? `${log.oldValue} → ${log.newValue}` : JSON.stringify(log.metadata || {}),
    new Date(log.timestamp).toISOString(),
  ]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "audit-logs.csv";
  a.click();
}

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    async function fetchLogs() {
      try {
        let q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
        if (filter !== "ALL") {
          q = query(collection(db, "auditLogs"), where("action", "==", filter), orderBy("timestamp", "desc"));
        }
        const snap = await getDocs(q);
        const list: any[] = [];
        snap.forEach((doc) => list.push({ id: doc.id, ...doc.data() }));
        setLogs(list);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, [filter]);

  if (loading) return <p className="p-6 text-gray-500">Loading audit logs...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <button
          onClick={() => exportCSV(logs)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Export to CSV
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="ALL">All</option>
          <option value="ROLE_UPDATED">Role Changes</option>
          <option value="DISPUTE_STATUS_CHANGED">Dispute Changes</option>
          <option value="INCIDENT_CREATED">Incident Reports</option>
          <option value="BLOG_PUBLISHED">Blogs Published</option>
          <option value="RENTER_FLAGGED">Fraud Alerts</option>
        </select>
      </div>

      <Card>
        <CardHeader><CardTitle>Audit Log Entries</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Action</th>
                  <th className="p-2">Target</th>
                  <th className="p-2">Changed By</th>
                  <th className="p-2">Details</th>
                  <th className="p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b">
                    <td className="p-2 font-semibold">{log.action}</td>
                    <td className="p-2">{log.targetUser || log.targetDispute || log.targetIncident || log.targetBlog || "—"}</td>
                    <td className="p-2">{log.changedBy}</td>
                    <td className="p-2">
                      {log.oldValue && log.newValue
                        ? `${log.oldValue} → ${log.newValue}`
                        : JSON.stringify(log.metadata || {})}
                    </td>
                    <td className="p-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
