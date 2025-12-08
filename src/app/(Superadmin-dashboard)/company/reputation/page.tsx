"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function ReputationPreviewPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/company/reputation/preview", {
      headers: { "company-id": "CURRENT_COMPANY_ID" }
    })
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  if (!data) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-12">

      <h1 className="text-3xl font-semibold">Reputation Preview</h1>

      <Card className="p-6 border-dashed bg-muted/30">
        <h2 className="text-xl font-semibold">RentFAX Reputation Score</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {data.message}
        </p>
        <div className="mt-6 py-10 text-center">
          <span className="text-6xl font-bold opacity-50">--</span>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="font-semibold">Dispute Resolution</p>
            <p className="text-sm text-muted-foreground">
              Resolved: {data.categories.disputeResolution}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">Incidents Logged</p>
            <p className="text-sm text-muted-foreground">
              Total: {data.categories.incidentBehavior}
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">Compliance Checks</p>
            <p className="text-sm text-muted-foreground">
              Passed: {data.categories.compliancePassed} / 3
            </p>
          </div>

          <div className="space-y-1">
            <p className="font-semibold">Transparency Score</p>
            <p className="text-sm text-muted-foreground">
              {data.categories.transparency} / 100
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Earned Badges</h3>
        {data.badges.length === 0 && (
          <p className="text-sm text-muted-foreground">No badges earned yet.</p>
        )}

        <div className="flex flex-wrap gap-2">
          {data.badges.map((b) => (
            <span
              key={b}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
            >
              {b.replace(/_/g, " ")}
            </span>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-muted">
        <h3 className="text-lg font-semibold">How to Improve</h3>
        <ul className="list-disc pl-6 text-sm mt-2 text-muted-foreground">
          <li>Resolve renter disputes faster</li>
          <li>Reduce severe incidents</li>
          <li>Keep communication response times low</li>
          <li>Verify business & insurance documents</li>
        </ul>
      </Card>
    </div>
  );
}
