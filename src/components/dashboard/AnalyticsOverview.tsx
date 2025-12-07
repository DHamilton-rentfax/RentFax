"use client";

import { Card } from "./ui/Card";

export default function AnalyticsOverview({ stats }: { stats: any }) {
  const items = [
    { label: "Total Reports", value: stats.totalReports },
    { label: "Active Renters", value: stats.activeRenters },
    { label: "Incidents", value: stats.incidents },
    { label: "Disputes", value: stats.disputes },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="text-center py-6">
          <h3 className="text-gray-500 text-sm">{item.label}</h3>
          <p className="text-2xl font-semibold text-[#1A2540]">
            {item.value ?? 0}
          </p>
        </Card>
      ))}
    </div>
  );
}
