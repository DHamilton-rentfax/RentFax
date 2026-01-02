"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Users, Building2, AlertTriangle, FileWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { hasPermission } from "@/lib/permissions";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/system-stats");
      const data = await res.json();
      setStats(data);
    }
    load();
  }, []);

  if (!stats) return <p className="p-10">Loading system analytics...</p>;

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-semibold">SuperAdmin Control Center</h1>
      <p className="text-muted-foreground pb-6">
        Global control panel – for system-wide oversight, analytics, and risk governance.
      </p>

      {/* Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewCard
          title="Total Renters"
          value={stats.totalRenters}
          icon={<Users className="h-6 w-6" />}
        />

        <OverviewCard
          title="Total Companies"
          value={stats.totalCompanies}
          icon={<Building2 className="h-6 w-6" />}
        />

        <OverviewCard
          title="Incidents (Last 30 days)"
          value={stats.incidentsLast30}
          icon={<AlertTriangle className="h-6 w-6" />}
        />

        <OverviewCard
          title="Disputes Pending"
          value={stats.pendingDisputes}
          icon={<FileWarning className="h-6 w-6" />}
        />

        <OverviewCard
          title="High-Risk Renters"
          value={stats.highRiskCount}
          icon={<ShieldCheck className="h-6 w-6" />}
        />
      </div>

      {/* Links to all admin modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        <AdminLink path="/admin/companies" label="Company Management" />
        <AdminLink path="/admin/renters" label="Global Renter Search" />
        <AdminLink path="/admin/incidents" label="Incident Oversight" />
        <AdminLink path="/admin/disputes" label="Dispute Queue" />
        <AdminLink path="/admin/fraud" label="Fraud Intelligence" />
        <AdminLink path="/admin/rules" label="System Rules" />
        <AdminLink path="/admin/settings" label="System Settings" />
        <AdminLink path="/admin/logs" label="System Logs" />
      </div>
    </div>
  );
}

function OverviewCard({ title, value, icon }: any) {
  return (
    <Card className="shadow-sm hover:shadow-md transition">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function AdminLink({ path, label }: any) {
  return (
    <Link href={path}>
      <Card className="p-6 hover:bg-muted cursor-pointer">
        <CardTitle>{label}</CardTitle>
      </Card>
    </Link>
  );
}
