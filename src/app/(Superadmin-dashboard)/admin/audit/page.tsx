"use client";
import { useEffect, useState } from "react";

export default function AuditAdmin() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Replace with your actual API call
    fetch("/api/admin/audit/list")
      .then(r => r.json())
      .then(d => setLogs(d));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">Enterprise Audit Logs</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Tenant ID</th>
            <th>User ID</th>
            <th>Action</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>
        {logs.map(log => (
          <tr key={log.id}>
            <td>{log.tenantId}</td>
            <td>{log.userId}</td>
            <td>{log.action}</td>
            <td>{new Date(log.timestamp).toLocaleString()}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
