'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import Protected from '@/components/protected';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Users, FileText, GitPullRequestArrow, CheckCircle2 } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Pie, Cell, ResponsiveContainer as RC, Bar, XAxis, YAxis, Tooltip, BarChart, PieChart } from 'recharts';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface Stats {
  rentersCount: number;
  incidentTypes: { name: string; value: number }[];
  riskBuckets: { name: string; value: number }[];
  disputesOpen: number;
  disputesResolved: number;
}

export default function AnalyticsPage() {
  const { claims } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const companyId = claims?.companyId;

  useEffect(() => {
    if (!companyId) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [rentersSnap, incidentsSnap, disputesSnap] = await Promise.all([
          getDocs(query(collection(db, 'renters'), where('companyId', '==', companyId))),
          getDocs(query(collection(db, 'incidents'), where('companyId', '==', companyId))),
          getDocs(query(collection(db, 'disputes'), where('companyId', '==', companyId)))
        ]);

        const riskDist: Record<string, number> = { Safe: 0, Moderate: 0, Risky: 0 };
        rentersSnap.forEach(doc => {
          const score = doc.data().riskScore ?? 0;
          const bucket = score >= 75 ? 'Safe' : score >= 50 ? 'Moderate' : 'Risky';
          riskDist[bucket]++;
        });

        const incidentTypes: Record<string, number> = {};
        incidentsSnap.forEach(doc => {
          const type = doc.data().type || 'other';
          incidentTypes[type] = (incidentTypes[type] || 0) + 1;
        });
        
        const newStats: Stats = {
          rentersCount: rentersSnap.size,
          incidentTypes: Object.entries(incidentTypes).map(([name, value]) => ({ name, value })),
          riskBuckets: Object.entries(riskDist).map(([name, value]) => ({ name, value })),
          disputesOpen: disputesSnap.docs.filter(d => d.data().status === 'open').length,
          disputesResolved: disputesSnap.docs.filter(d => d.data().status === 'resolved').length,
        };

        setStats(newStats);
      } catch (err: any) {
        console.error(err);
        setError('Could not load analytics data. Check permissions and Firestore indexes.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [companyId]);

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="space-y-4">
        <h1 className="text-2xl font-headline">Analytics Dashboard</h1>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
        ) : error ? (
           <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
             <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
             <p className="font-bold">Analytics Error</p>
             <p className="text-sm">{error}</p>
           </div>
        ) : stats ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Renters</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.rentersCount}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.incidentTypes.reduce((acc, t) => acc + t.value, 0)}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Disputes</CardTitle>
                  <GitPullRequestArrow className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.disputesOpen}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resolved Disputes</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.disputesResolved}</div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Breakdown of renter risk scores.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                    <PieChart>
                      <Pie data={stats.riskBuckets} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {stats.riskBuckets.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Incident Mix</CardTitle>
                  <CardDescription>Breakdown of reported incident types.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{}} className="h-[250px] w-full">
                     <BarChart data={stats.incidentTypes} layout="vertical" margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                          <XAxis type="number" hide />
                          <YAxis type="category" dataKey="name" width={80} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                     </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </Protected>
  );
}
