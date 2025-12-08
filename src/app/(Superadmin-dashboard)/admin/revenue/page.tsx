"use client";

import { useEffect, useState } from "react";
import { getRevenueMetrics } from "@/actions/revenue/metrics";
import { StatCard } from "@/components/admin/revenue/StatCard";
import { RevenueCharts } from "@/components/admin/revenue/RevenueCharts";
import { RepLeaderboard } from "@/components/admin/revenue/RepLeaderboard";
import { PipelineSummary } from "@/components/admin/revenue/PipelineSummary";
import { ForecastBlock } from "@/components/admin/revenue/ForecastBlock";

export default function RevenueDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getRevenueMetrics().then(setData);
  }, []);

  if (!data) return <div>Loading revenue…</div>;

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Revenue Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total MRR" value={`$${data.totalMRR.toLocaleString()}`} />
        <StatCard title="Total ARR" value={`$${data.totalARR.toLocaleString()}`} />
        <StatCard title="New MRR (30d)" value={`$${data.newMRR.toLocaleString()}`} />
      </div>

      <RevenueCharts data={data} />
      <PipelineSummary data={data} />
      <RepLeaderboard data={data} />
      <ForecastBlock data={data} />
    </div>
  );
}
