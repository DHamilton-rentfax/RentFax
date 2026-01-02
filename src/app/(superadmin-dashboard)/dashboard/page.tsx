"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/superadmin/cards/StatCard";
import TrendCard from "@/components/superadmin/cards/TrendCard";
import BarChartMinimal from "@/components/superadmin/charts/BarChartMinimal";
import LineChartMinimal from "@/components/superadmin/charts/LineChartMinimal";
import { Loader2 } from "lucide-react";

export default function SuperAdminHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/superadmin/analytics");
        const json = await res.json();
        setStats(json);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10">

      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          System-wide metrics, activity monitoring & platform health.
        </p>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Companies" value={stats.totalCompanies} />
        <StatCard label="Total Renters" value={stats.totalRenters} />
        <StatCard label="Searches (30 days)" value={stats.searchLast30} />
        <StatCard label="Verifications (30 days)" value={stats.verifyLast30} />
      </div>

      {/* TRENDS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TrendCard
          label="Daily Searches"
          value={stats.searchToday}
          change={stats.searchChange}
        />
        <TrendCard
          label="Identity Verifications"
          value={stats.verifyToday}
          change={stats.verifyChange}
        />
        <TrendCard
          label="Risk Engine Flags"
          value={stats.riskFlagsToday}
          change={stats.riskFlagsChange}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <BarChartMinimal
          title="Search Volume (Last 30 Days)"
          labels={stats.searchChart.labels}
          values={stats.searchChart.values}
        />
        <LineChartMinimal
          title="Verification Trend"
          labels={stats.verifyChart.labels}
          values={stats.verifyChart.values}
        />
      </div>
    </div>
  );
}
