"use client";

import { useEffect, useState } from "react";

interface AuditLog {
  id: string;
  eventType: string;
  severity: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  targetCollection: string;
  targetId: string;
  metadata: any;
}

export default function AuditDashboard() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetch("/api/audit/list")
      .then((res) => res.json())
      .then((d) => setLogs(d.logs));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">System Audit Log</h1>

      <div className="border rounded-xl divide-y">
        {logs.map((log) => (
          <div key={log.id} className="p-4">
            <div className="font-semibold">
              {log.eventType} • {log.severity.toUpperCase()}
            </div>
            <div className="text-sm text-gray-600">
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">
              Actor: {log.actorId} ({log.actorRole || "unknown"})
            </div>
            <div className="text-xs text-gray-500">
              Target: {log.targetCollection} / {log.targetId}
            </div>
            {log.metadata && (
              <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
