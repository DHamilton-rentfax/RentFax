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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

export default function AnalyticsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const { claims } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyId = claims?.companyId;

  useEffect(() => {
    if (!companyId) return;

    setLoading(true);
    setError(null);
    fetch(`/api/analytics/incident-mix?companyId=${companyId}`)
      .then((r) => {
        if (!r.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        return r.json();
      })
      .then((d) => setRows(d.rows || []))
      .catch((err) => {
        console.error(err);
        setError('Could not load analytics data. Ensure BigQuery export is configured correctly.');
      })
      .finally(() => setLoading(false));
  }, [companyId]);

  return (
    <Protected roles={['owner', 'manager']}>
      <div className="space-y-4">
        <h1 className="text-2xl font-headline">Analytics</h1>
        <Card>
          <CardHeader>
            <CardTitle>Incident Mix (Monthly)</CardTitle>
            <CardDescription>
              A high-level overview of incident types reported by your company over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
                <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-center text-destructive">
                    <AlertTriangle className="mx-auto mb-2 h-8 w-8" />
                    <p className="font-bold">Analytics Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{new Date(r.month.value).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</TableCell>
                      <TableCell>{r.type}</TableCell>
                      <TableCell>{r.severity}</TableCell>
                      <TableCell>{r.cnt}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            )}
            {!loading && !error && rows.length === 0 && (
                <div className="text-center p-8 text-muted-foreground">
                    No incident data found to display.
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
