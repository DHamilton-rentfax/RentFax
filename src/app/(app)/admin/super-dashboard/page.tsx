
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/client";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import RealTimeNotifications from "@/components/admin/RealTimeNotifications";
import DemoAnalytics from "@/components/DemoAnalytics";

export default function SuperAdminDashboard() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<any>({
    users: 0,
    companies: 0,
    incidents: 0,
    disputes: 0,
    blogs: 0,
    fraud: 0,
    loading: true,
  });

  useEffect(() => {
    if (!loading) {
      if (!user || role !== "SUPER_ADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, role, loading, router]);

  useEffect(() => {
    if (role !== "SUPER_ADMIN") return;

    async function fetchStats() {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const companiesSnap = await getDocs(collection(db, "companies"));
        const incidentsSnap = await getDocs(collection(db, "incidents"));
        const disputesSnap = await getDocs(collection(db, "disputes"));
        const blogsSnap = await getDocs(collection(db, "blogs"));
        const fraudSnap = await getDocs(
          query(collection(db, "renters"), where("alert", "==", true))
        );

        setStats({
          users: usersSnap.size,
          companies: companiesSnap.size,
          incidents: incidentsSnap.size,
          disputes: disputesSnap.size,
          blogs: blogsSnap.size,
          fraud: fraudSnap.size,
          loading: false,
        });
      } catch (err) {
        console.error("Error fetching stats", err);
        setStats((s: any) => ({ ...s, loading: false }));
      }
    }

    fetchStats();
  }, [role]);

  if (loading || stats.loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  if (!user || role !== "SUPER_ADMIN") {
    return null;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">RentFAX Super Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Top Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <MetricCard title="Total Users" value={stats.users} />
            <MetricCard title="Companies" value={stats.companies} />
            <MetricCard title="Incidents" value={stats.incidents} />
            <MetricCard title="Disputes" value={stats.disputes} />
            <MetricCard title="Fraud Alerts" value={stats.fraud} />
            <MetricCard title="Blogs" value={stats.blogs} />
          </div>
          
          {/* Demo Analytics */}
          <DemoAnalytics />

        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Real-Time Alerts */}
          <RealTimeNotifications />
          
          <DashboardLink href="/admin/super-dashboard/system-health" title="System Health & Analytics" desc="View ops dashboard & metrics" />
            <DashboardLink href="/admin/super-dashboard/users" title="Manage Users" desc="Admins, Editors, Roles" />
            <DashboardLink href="/admin/super-dashboard/companies" title="Manage Companies" desc="View teams & landlords" />
            <DashboardLink href="/admin/super-dashboard/blogs" title="Manage Blogs" desc="Authors, publish, analytics" />
            <DashboardLink href="/admin/super-dashboard/disputes" title="Manage Disputes" desc="Review disputes & statuses" />
            <DashboardLink href="/admin/super-dashboard/incidents" title="Manage Incidents" desc="Track reports & evidence" />
            <DashboardLink href="/admin/super-dashboard/fraud" title="Fraud Monitoring" desc="High risk renters & alerts" />
            <DashboardLink href="/admin/super-dashboard/audit-log" title="View Audit Logs" desc="Track all platform actions" />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: number; }) {
  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function DashboardLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-lg transition cursor-pointer h-full">
        <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-gray-600">{desc}</p></CardContent>
      </Card>
    </Link>
  );
}
