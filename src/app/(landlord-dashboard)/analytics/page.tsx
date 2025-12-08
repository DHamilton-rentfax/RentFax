"use client";

import { useEffect, useState } from "react";
import CompanyRiskCard from "@/components/landlord/CompanyRiskCard";
import DistributionPieChart from "@/components/landlord/DistributionPieChart";
import TrendBarChart from "@/components/landlord/TrendBarChart";
import EmployeeAlerts from "@/components/landlord/EmployeeAlerts";

// TODO: Replace with dynamic companyId from user session
const TEMP_COMPANY_ID = "COMP-123";

export default function LandlordAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/landlord/companies/${TEMP_COMPANY_ID}/analytics`);
        if (!res.ok) throw new Error("Failed to load analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return <div className="p-6">Loading company analytics...</div>;
  }

  if (!analytics) {
    return <div className="p-6">Could not load analytics.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Company Analytics Dashboard</h1>

      {/* Top Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CompanyRiskCard 
          label="Company Risk Rating" 
          value={`${analytics.companyRiskRating}/100`} 
          description="AI-generated score based on your renter portfolio's risk profile."
        />
        <CompanyRiskCard 
          label="Total Incidents" 
          value={analytics.incidentCount} 
          description="Total incidents filed by your company."
        />
        <CompanyRiskCard 
          label="Total Disputes" 
          value={analytics.disputeCount} 
          description="Total disputes involving your company."
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DistributionPieChart data={analytics.renterRiskDistribution} />
        <TrendBarChart title="Incident Trends" data={analytics.incidentTrends} />
      </div>

      {/* Employee Alerts */}
      <EmployeeAlerts alerts={analytics.employeeMisuseAlerts} />

    </div>
  );
}
