'''use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, AlertTriangle } from "lucide-react";

export default function RenterDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/renter/dashboard")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Your Renter Dashboard</h1>

      <Card className="p-6 bg-muted/40 border-dashed">
        <h2 className="text-xl font-semibold">RentFAX Score (Coming Soon)</h2>
        <p className="text-sm text-muted-foreground mt-2">
          A new national renter trust model currently in testing.
        </p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Your Risk Score</h2>
          <p className="text-4xl font-bold mt-4">{data.riskScore}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Verification Status</h2>
          <p className="mt-2">{data.verified ? "Verified" : "Pending"}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Recent Alerts</h2>

        <ul className="space-y-2 mt-3">
          {data.alerts.map((a: any, i: number) => (
            <li key={i} className="text-sm flex gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              {a.message}
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-2">Your Incidents</h2>

        <ul className="space-y-3">
          {data.incidents.map((i: any) => (
            <li key={i.id} className="flex justify-between">
              <span>{i.type}</span>
              <a href={`/renter/incidents/${i.id}`} className="text-blue-500 text-sm">
                View <ArrowUpRight className="inline-block w-4 h-4" />
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
