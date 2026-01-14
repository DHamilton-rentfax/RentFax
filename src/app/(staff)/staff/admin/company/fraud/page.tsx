"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CompanyFraudDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/company/fraud/summary");
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p className="p-10">Loading fraud insights…</p>;

  return (
    <div className="p-10 space-y-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold">Company Fraud & Risk Center</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Metric label="High Risk Renters" value={data.highRisk} />
        <Metric label="Pending Disputes" value={data.pendingDisputes} />
        <Metric label="Banned Renters" value={data.bannedCount} />
      </div>

      {/* Fraud Alerts Feed */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Fraud Alerts</h2>

        {data.alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent alerts.</p>
        ) : (
          <div className="space-y-3">
            {data.alerts.map((a: any, i: number) => (
              <Card key={i} className="p-4 shadow-sm flex justify-between">
                <div>
                  <p className="font-semibold">{a.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>
                <Badge variant="destructive">{a.type}</Badge>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* High Risk Renters */}
      <section className="space-y-4 mt-10">
        <h2 className="text-2xl font-semibold">High Risk Renters</h2>
        <Card className="p-4 shadow-sm">
          {data.renters.length === 0 && (
            <p className="text-sm text-muted-foreground">No high-risk renters.</p>
          )}

          {data.renters.map((r: any) => (
            <div key={r.id} className="border-b last:border-none py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{r.fullName}</p>
                <p className="text-xs text-muted-foreground">
                  {r.incidentCount} incidents — {r.riskScore} risk score
                </p>
              </div>
              <div className="flex gap-3">
                <Link href={`/dashboard/renters/${r.id}`}>
                  <Badge>View Profile</Badge>
                </Link>
                <BanButton renterId={r.id} banned={r.banned} />
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <Card className="p-6 shadow-sm text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </Card>
  );
}

function BanButton({ renterId, banned }: any) {
  async function toggle() {
    await fetch("/api/renters/ban", {
      method: "POST",
      body: JSON.stringify({ renterId }),
    });
    window.location.reload();
  }

  return (
    <Button variant={banned ? "default" : "destructive"} onClick={toggle}>
      {banned ? "Unban" : "Ban"}
    </Button>
  );
}