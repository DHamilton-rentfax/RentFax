'use client';

import { useEffect, useState } from 'react';

type FraudReport = { id: string; type: string; orgId: string; severity: string; createdAt: number };

export default function GlobalFraudPage() {
  const [reports, setReports] = useState<FraudReport[]>([]);

  useEffect(() => {
    fetch('/api/admin/fraud').then(r => r.json()).then(setReports);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Global Fraud Monitor</h1>
      <div className="space-y-3">
        {reports.map(r => (
          <div key={r.id} className="border p-4 rounded bg-white shadow">
            <p>
              <b>{r.type}</b> — {r.severity} in <span className="text-blue-600">{r.orgId}</span>
            </p>
            <p className="text-xs text-gray-500">Detected {new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
