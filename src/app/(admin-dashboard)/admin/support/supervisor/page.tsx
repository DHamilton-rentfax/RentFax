"use client";

import { useEffect, useState } from "react";

const StatCard = ({ label, value }: { label: string, value: number }) => (
  <div className="bg-white p-6 rounded-xl border">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-3xl font-bold mt-1">{value}</div>
  </div>
);

const WorkloadHeatmap = ({ staff }: { staff: any[] }) => (
    <div className="bg-white p-6 rounded-xl border">
        <h2 className="font-semibold mb-4">Staff Workload (Last 7 Days)</h2>
        <div className="space-y-3">
            {staff.map(s => (
                <div key={s.name} className="flex justify-between items-center">
                    <span className="font-medium">{s.name}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">{s.closed} Closed</span>
                        <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">{s.open} Open</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function SupervisorDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        fetch('/api/support/supervisor')
            .then(res => res.json())
            .then(data => setStats(data));
    }, []);

    if (!stats) {
        return <div>Loading supervisor dashboard...</div>;
    }

  return (
    <div className="max-w-6xl mx-auto py-10">
        <h1 className="text-3xl font-semibold mb-8">Supervisor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Unassigned Tickets" value={stats.unassignedCount} />
        <StatCard label="Pending Tickets" value={stats.pendingCount} />
        <StatCard label="Needs Superadmin" value={stats.escalatedCount} />
      </div>

      <WorkloadHeatmap staff={stats.staffWorkloads} />
    </div>
  );
}
