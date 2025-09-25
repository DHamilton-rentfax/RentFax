"use client";

import { useEffect, useState } from "react";

type GlobalStats = {
  totalOrgs: number;
  totalRenters: number;
  totalDisputes: number;
  fraudFlags: number;
};

export default function SuperDashboard() {
  const [stats, setStats] = useState<GlobalStats | null>(null);

  useEffect(() => {
    fetch("/api/admin/global-stats")
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div className="p-4 border rounded shadow"><h3>Orgs</h3><p>{stats.totalOrgs}</p></div>
      <div className="p-4 border rounded shadow"><h3>Renters</h3><p>{stats.totalRenters}</p></div>
      <div className="p-4 border rounded shadow"><h3>Disputes</h3><p>{stats.totalDisputes}</p></div>
      <div className="p-4 border rounded shadow"><h3>Fraud Flags</h3><p>{stats.fraudFlags}</p></div>
    </div>
  );
}
