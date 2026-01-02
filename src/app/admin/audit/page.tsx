'use client';

import { useEffect, useState } from "react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/audit")
      .then(r => r.json())
      .then(setLogs);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">Audit Log</h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Type</th>
            <th className="text-left p-2">Report</th>
            <th className="text-left p-2">Actor</th>
            <th className="text-left p-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.ts} className="border-b">
              <td className="p-2">{l.type}</td>
              <td className="p-2">{l.reportId}</td>
              <td className="p-2">{l.actor || "system"}</td>
              <td className="p-2">
                {new Date(l.ts).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
