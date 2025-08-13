'use client';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Users,
  FileText,
  ShieldQuestion,
  PlusCircle,
  Upload,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, PieChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

function StatCard({ title, value, link, linkText, icon: Icon }: { title: string; value: string | number, link: string, linkText?: string, icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {linkText && (
          <Link href={link} className="text-xs text-muted-foreground hover:underline">
            {linkText}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { claims } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claims?.companyId) return;

    const fetchStats = async () => {
        try {
            const rentersSnap = await getDocs(query(collection(db, 'renters'), where('companyId', '==', claims.companyId)));
            const incidentsSnap = await getDocs(query(collection(db, 'incidents'), where('companyId', '==', claims.companyId)));
            const disputesSnap = await getDocs(query(collection(db, 'disputes'), where('companyId', '==', claims.companyId), where('status', '==', 'open')));

            setStats({
                renters: rentersSnap.size,
                incidents: incidentsSnap.size,
                disputes: disputesSnap.size,
            });
        } catch(e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    fetchStats();
  }, [claims]);


  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
          <p className="text-muted-foreground">An overview of your rental operations.</p>
        </div>
        <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link href="/dashboard/admin/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                </Link>
            </Button>
            <Button asChild>
                <Link href="/renters/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Renter
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
        </> : <>
            <StatCard title="Total Renters" value={stats?.renters ?? 0} link="/dashboard/renters" icon={Users} />
            <StatCard title="Total Incidents" value={stats?.incidents ?? 0} link="/dashboard/incidents" icon={FileText} />
            <StatCard title="Active Disputes" value={stats?.disputes ?? 0} link="/dashboard/disputes" icon={ShieldQuestion} />
        </>}
      </div>
      
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-full lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              You have 3 new disputes to review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity feed */}
             <p className="text-muted-foreground">Recent activity feed will be shown here.</p>
          </CardContent>
        </Card>
        <Card className="col-span-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Risk Overview</CardTitle>
             <CardDescription>
              A breakdown of renter risk profiles.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {/* Placeholder for risk overview chart */}
             <p className="text-muted-foreground">Renter risk chart will be shown here.</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
