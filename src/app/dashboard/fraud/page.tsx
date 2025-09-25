'use client';

import { useEffect, useState } from 'react';

type FraudReport = { id: string; type: string; severity: string; details: any; createdAt: number };

export default function FraudPage() {
  const [reports, setReports] = useState<FraudReport[]>([]);

  useEffect(() => {
    fetch('/api/client/fraud?orgId=demo-org').then(r => r.json()).then(setReports);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fraud Monitor</h1>
      <div className="space-y-3">
        {reports.map(r => (
          <div key={r.id} className={`border p-4 rounded bg-white shadow ${r.severity === 'high' ? 'border-red-600' : 'border-yellow-500'}`}>
            <p><b>{r.type}</b> — Severity: <span className="uppercase">{r.severity}</span></p>
            {r.details?.matched && (
              <p className="text-sm text-gray-600">Matched Renters: {r.details.matched.join(', ')}</p>
            )}
            <p className="text-xs text-gray-500">Detected {new Date(r.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
