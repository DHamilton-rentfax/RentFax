'use client';

import { useEffect, useState } from "react";

type DigestRun = {
  id: string;
  startedAt: number;
  frequency: string;
  totalSent: number;
  totalFailed: number;
  logs: { uid: string; email: string; status: string }[];
};

export default function DigestDashboard() {
  const [runs, setRuns] = useState<DigestRun[]>([]);
  const [selected, setSelected] = useState<DigestRun | null>(null);
  const [isRerunning, setIsRerunning] = useState(false);

  useEffect(() => {
    fetch("/api/admin/digests").then(r => r.json()).then(setRuns);
  }, []);

  async function rerunFailed(runId: string) {
    if (!selected || isRerunning) return;

    setIsRerunning(true);
    
    await fetch("/api/admin/digests/rerun-failed", {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ runId }),
    });

    const updatedRuns = await fetch("/api/admin/digests").then(r => r.json());
    setRuns(updatedRuns);
    const newSelected = updatedRuns.find((r: DigestRun) => r.id === runId);
    if (newSelected) {
      setSelected(newSelected);
    }
    
    setIsRerunning(false);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Digest Email Runs</h1>

      {!selected && (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Frequency</th>
              <th className="p-2 border">Sent</th>
              <th className="p-2 border">Failed</th>
              <th className="p-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {runs.map(run => (
              <tr key={run.id}>
                <td className="p-2 border">{new Date(run.startedAt).toLocaleString()}</td>
                <td className="p-2 border">{run.frequency}</td>
                <td className="p-2 border text-green-600">{run.totalSent}</td>
                <td className="p-2 border text-red-600">{run.totalFailed}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => setSelected(run)}
                    className="text-blue-600 underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selected && (
        <div>
          <div className="flex items-center mb-4 space-x-4">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                ← Back
              </button>
              {selected.totalFailed > 0 && (
                <button
                  onClick={() => rerunFailed(selected.id)}
                  disabled={isRerunning}
                  className="bg-blue-600 text-white px-3 py-1 rounded disabled:bg-blue-300"
                >
                  {isRerunning ? 'Rerunning...' : `Re-run ${selected.totalFailed} Failed`}
                </button>
              )}
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Run from {new Date(selected.startedAt).toLocaleString()}
          </h2>
          <ul className="space-y-2">
            {selected.logs.map(log => (
              <li
                key={log.uid}
                className={`p-2 border rounded ${log.status === 'failed' ? 'bg-red-50' : 'bg-green-50'}`}
              >
                {log.email} — {log.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
