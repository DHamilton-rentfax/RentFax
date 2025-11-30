"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DownloadReportButton } from "@/components/reports/DownloadReportButton";
import { Shield, FileWarning, History } from "lucide-react";

export default function RenterDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const { getRenterDashboard } = await import("@/app/actions/get-renter-dashboard");
      const d = await getRenterDashboard();
      setData(d);
    }
    load();
  }, []);

  if (!data) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-semibold">My Rental Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card className="shadow-sm border">
          <CardContent className="p-6 space-y-3">
            <p className="text-gray-500">Universal Reputation Score</p>
            <p className="text-4xl font-bold">{data.universalScore}</p>
            <Progress value={data.universalScore} />
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-6 space-y-3">
            <p className="text-gray-500">Incidents On File</p>
            <p className="text-4xl font-bold">{data.incidentCount}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardContent className="p-6 space-y-3">
            <p className="text-gray-500">Disputes</p>
            <p className="text-4xl font-bold">{data.disputeCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Alert section */}
      <Card className="border border-yellow-300 bg-yellow-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-yellow-700">
            <FileWarning className="h-5 w-5" />
            Important Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.alerts.length === 0 
            ? "You have no alerts."
            : data.alerts.map((alert: string, i: number) => (
                <p key={i}>• {alert}</p>
              ))}
        </CardContent>
      </Card>

      <div>
        <DownloadReportButton renterId={data.uid} landlordId={data.uid} />
      </div>
    </div>
  );
}
