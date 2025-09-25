'use client';

import { useEffect, useState } from "react";

type ReportData = {
  totalRenters: number;
  openDisputes: number;
  incidentsThisMonth: number;
  riskDistribution: Record<string, number>;
};

export default function ClientReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    fetch("/api/client/reports?orgId=demo-org").then(r => r.json()).then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Portfolio Reports</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">Total Renters: {data.totalRenters}</div>
        <div className="bg-white p-4 rounded shadow">Open Disputes: {data.openDisputes}</div>
        <div className="bg-white p-4 rounded shadow">Incidents This Month: {data.incidentsThisMonth}</div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Risk Distribution</h2>
        <ul className="list-disc pl-6">
          {Object.entries(data.riskDistribution).map(([risk, count]) => (
            <li key={risk}>{risk}: {count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
