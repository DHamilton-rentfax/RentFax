"use client";

import { useEffect, useState } from "react";
import RiskSummaryCard from "@/components/superadmin/RiskSummaryCard";
import HighRiskTable from "@/components/superadmin/HighRiskTable";
import FraudClusterMap from "@/components/superadmin/FraudClusterMap";
import TrendChart from "@/components/superadmin/TrendChart";

export default function GlobalRiskDashboard() {
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/superadmin/risk/global");
      const json = await res.json();
      setSnapshot(json);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-600">
        Loading intelligence…
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      <h1 className="text-3xl font-bold">Global Risk Dashboard</h1>
      <p className="text-gray-600">Nationwide renter intelligence overview.</p>

      {/* Top-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <RiskSummaryCard
          label="High-Risk Renters"
          value={snapshot.highRiskCount}
          trend={snapshot.trends.highRiskDelta}
        />
        <RiskSummaryCard
          label="Moderate Risk"
          value={snapshot.moderateRiskCount}
          trend={snapshot.trends.moderateRiskDelta}
        />
        <RiskSummaryCard
          label="Low Risk"
          value={snapshot.lowRiskCount}
          trend={snapshot.trends.lowRiskDelta}
        />
        <RiskSummaryCard
          label="Fraud Signals (Active)"
          value={snapshot.activeFraudSignals}
          trend={snapshot.trends.fraudDelta}
        />
      </div>

      {/* Risk Trends Chart */}
      <TrendChart data={snapshot.trends.history} />

      {/* Fraud cluster map */}
      <FraudClusterMap clusters={snapshot.fraudClusters} />

      {/* High-risk renters */}
      <HighRiskTable renters={snapshot.highRiskRenters} />
    </div>
  );
}
