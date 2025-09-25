"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Stats = {
  renters: number;
  incidents: number;
  disputes: number;
};

export default function ReportsPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/reports/summary")
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <Card><CardContent><h3>Renters</h3><p>{stats.renters}</p></CardContent></Card>
      <Card><CardContent><h3>Incidents</h3><p>{stats.incidents}</p></CardContent></Card>
      <Card><CardContent><h3>Disputes</h3><p>{stats.disputes}</p></CardContent></Card>
    </div>
  );
}
