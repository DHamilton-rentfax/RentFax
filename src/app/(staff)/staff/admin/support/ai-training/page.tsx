"use client";

import { useEffect, useState } from "react";

const StatCard = ({ label, value }: { label: string, value: string | number }) => (
  <div className="bg-white p-6 rounded-xl border">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-3xl font-bold mt-1">{value}</div>
  </div>
);

export default function AiTrainingDashboard() {
  const [items, setItems] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/support/ai-feedback/list")
      .then(res => res.json())
      .then(data => {
        setItems(data.items)
        calculateStats(data.items)
      });
  }, []);

  function calculateStats(data: any[]) {
    const total = data.length;
    const severityCounts = data.reduce((acc, item) => {
      acc[item.severity] = (acc[item.severity] || 0) + 1;
      return acc;
    }, {});
    const typeCounts = data.reduce((acc, item) => {
        acc[item.improvementType] = (acc[item.improvementType] || 0) + 1;
        return acc;
      }, {});
    const mostCommonType = Object.entries(typeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A';

    setStats({
      total,
      severity1: severityCounts['1'] || 0,
      severity2: severityCounts['2'] || 0,
      severity3: severityCounts['3'] || 0,
      mostCommonType,
    });
  }

  async function exportDataset() {
    const res = await fetch('/api/support/ai-feedback/export');
    const data = await res.json();
    const json = JSON.stringify(data.dataset, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ai-feedback-dataset.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">AI Support Training Dashboard</h1>
        <button 
            onClick={exportDataset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Export Training Data
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Total Corrections" value={stats.total} />
            <StatCard label="Severity 1 (Minor)" value={stats.severity1} />
            <StatCard label="Severity 2 (Moderate)" value={stats.severity2} />
            <StatCard label="Severity 3 (Critical)" value={stats.severity3} />
        </div>
      )}

      <div className="border rounded-xl divide-y bg-white">
        {items.map(item => (
          <div key={item.id} className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <span className="font-semibold text-red-600">
                        Issue: {item.improvementType} (Severity {item.severity})
                    </span>
                    <span className="text-xs text-gray-500 ml-2">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <a href={`/admin/support/inbox/${item.threadId}`} target="_blank" className="text-xs text-blue-600 hover:underline">View Thread</a>
            </div>

            <div className="text-sm text-gray-700 mt-2">
              <span className="font-semibold">User Query:</span> {item.originalQuery}
            </div>

            <div className="text-sm text-gray-500 mt-1 bg-gray-50 p-2 rounded">
              <span className="font-semibold">AI Response:</span> {item.aiResponse}
            </div>

            <div className="text-sm text-green-700 mt-1 bg-green-50 p-2 rounded">
              <span className="font-semibold">Corrected Answer:</span> {item.correctedResponse}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
