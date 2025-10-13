"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export default function DemoAnalytics() {
  const [stats, setStats] = useState<any>({
    demo_role_selected_renter: 0,
    demo_role_selected_company: 0,
    demo_renter_report_viewed: 0,
    demo_company_dashboard_viewed: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchDemoStats() {
      try {
        const snap = await getDocs(collection(db, "demo_analytics"));
        const newStats = { ...stats, loading: false };

        snap.forEach((doc) => {
          const event = doc.data();
          if (event.eventName === "demo_role_selected") {
            if (event.params.role === "RENTER") {
              newStats.demo_role_selected_renter++;
            } else if (event.params.role === "COMPANY") {
              newStats.demo_role_selected_company++;
            }
          } else if (event.eventName === "demo_renter_report_viewed") {
            newStats.demo_renter_report_viewed++;
          } else if (event.eventName === "demo_company_dashboard_viewed") {
            newStats.demo_company_dashboard_viewed++;
          }
        });

        setStats(newStats);
      } catch (err) {
        console.error("Error fetching demo stats", err);
        setStats((s: any) => ({ ...s, loading: false }));
      }
    }

    fetchDemoStats();
  }, []);

  if (stats.loading) {
    return <p className="text-sm text-gray-500">Loading demo stats...</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Demo Engagement Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Renter Clicks"
          value={stats.demo_role_selected_renter}
        />
        <MetricCard
          title="Company Clicks"
          value={stats.demo_role_selected_company}
        />
        <MetricCard
          title="Renter Reports"
          value={stats.demo_renter_report_viewed}
        />
        <MetricCard
          title="Company Dashboards"
          value={stats.demo_company_dashboard_viewed}
        />
      </div>
    </div>
  );
}
