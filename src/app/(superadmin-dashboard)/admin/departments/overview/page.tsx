'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/types';

interface DeptAnalytics {
  totalUsers: number;
  totalIncidents: number;
  totalDisputes: number;
  fraudAlerts: number;
}

export default function DepartmentOverviewPage() {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, DeptAnalytics>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    loadDepartments();
  }, [token, toast]);

  const loadDepartments = async () => {
    try {
      const res = await fetch('/api/admin/departments');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDepartments(data.departments || []);

      // Fetch analytics in parallel
      const results: Record<string, DeptAnalytics> = {};
      await Promise.all(
        (data.departments || []).map(async (d: Department) => {
          const aRes = await fetch(`/api/admin/departments/${d.id}/analytics`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const aData = await aRes.json();
          if (aRes.ok && aData.analytics) results[d.id] = aData.analytics;
        })
      );
      setAnalytics(results);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const totals = Object.values(analytics).reduce(
    (acc, a) => ({
      totalUsers: acc.totalUsers + (a.totalUsers || 0),
      totalIncidents: acc.totalIncidents + (a.totalIncidents || 0),
      totalDisputes: acc.totalDisputes + (a.totalDisputes || 0),
      fraudAlerts: acc.fraudAlerts + (a.fraudAlerts || 0),
    }),
    { totalUsers: 0, totalIncidents: 0, totalDisputes: 0, fraudAlerts: 0 }
  );

  if (loading) return <p>Loading department analytics...</p>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Department Overview</h1>
        <Link href="/admin/departments">
          <Button variant="outline">Manage Departments</Button>
        </Link>
      </header>

      <div className="grid md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle>Total Users</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{totals.totalUsers}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Incidents</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{totals.totalIncidents}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Disputes</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold">{totals.totalDisputes}</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Total Fraud Alerts</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-semibold text-red-600">{totals.fraudAlerts}</p></CardContent>
        </Card>
      </div>

      {departments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No departments available yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map(dept => {
            const stats = analytics[dept.id] || {};
            const fraudSeverity =
              (stats.fraudAlerts || 0) > 10 ? 'text-red-600' : 'text-muted-foreground';

            return (
              <Card key={dept.id} className="hover:shadow-md transition-all">
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="flex justify-between w-full">
                    <span>{dept.name}</span>
                    <Link href={`/admin/departments/${dept.id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Users</p>
                      <p className="text-xl font-semibold">{stats.totalUsers ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Incidents</p>
                      <p className="text-xl font-semibold">{stats.totalIncidents ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Disputes</p>
                      <p className="text-xl font-semibold">{stats.totalDisputes ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fraud Alerts</p>
                      <p className={`text-xl font-semibold ${fraudSeverity}`}>
                        {stats.fraudAlerts ?? '—'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
