'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import Link from 'next/link';

export default function IncidentsPage() {
  const { claims } = useAuth();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claims?.companyId) return;

    const q = query(
      collection(db, 'incidents'),
      where('companyId', '==', claims.companyId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const incidentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIncidents(incidentData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [claims]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-headline">Incidents</h1>
      <Card>
        <CardHeader>
          <CardTitle>Incident Log</CardTitle>
          <CardDescription>
            Review all reported incidents for your company.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Renter ID</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-5 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-5 w-12 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        {incident.createdAt
                          ? format(incident.createdAt.toDate(), 'PPP')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                         <Link href={`/dashboard/incidents/${incident.id}`} className="hover:underline text-primary capitalize">
                            {incident.type}
                         </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            incident.severity === 'severe'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/renters/${incident.renterId}`} className="hover:underline text-primary font-mono text-xs">
                            {incident.renterId}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        ${incident.amount?.toFixed(2) || '0.00'}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {!loading && incidents.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No incidents found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
