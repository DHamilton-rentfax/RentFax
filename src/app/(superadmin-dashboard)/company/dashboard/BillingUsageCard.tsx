"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BillingUsageCard({ stats }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Identity Checks Purchased:</span>
          <strong>{stats?.identityChecks ?? 0}</strong>
        </div>
        <div className="flex justify-between">
          <span>Risk Reports Purchased:</span>
          <strong>{stats?.reportsPurchased ?? 0}</strong>
        </div>
        <div className="flex justify-between">
          <span>Total Spend:</span>
          <strong>${(stats?.totalSpend ?? 0).toFixed(2)}</strong>
        </div>
      </CardContent>
    </Card>
  );
}
