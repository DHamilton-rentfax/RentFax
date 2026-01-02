"use client";

import { Card } from "@/components/ui/card";

export default function CompanyBehaviorPage() {
  const metrics = {
    avgResponseTime: null,
    avgSupportRating: null,
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Customer Service Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Avg Response Time</p>
          <p className="text-2xl font-bold">
            {metrics.avgResponseTime ? `${metrics.avgResponseTime} hrs` : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avg Support Rating</p>
          <p className="text-2xl font-bold">
            {metrics.avgSupportRating || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
}