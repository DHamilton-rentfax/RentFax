
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
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

export default function DisputesPage() {
  const { claims } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!claims?.companyId) return;

    const q = query(
      collection(db, 'disputes'),
      where('companyId', '==', claims.companyId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const disputeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDisputes(disputeData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [claims]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-headline">Disputes</h1>
      <Card>
        <CardHeader>
          <CardTitle>Dispute Queue</CardTitle>
          <CardDescription>
            Review and manage all open and recent disputes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead>Renter ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opened On</TableHead>
                <TableHead>SLA Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    </TableRow>
                  ))
                : disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/disputes/${dispute.id}`}
                          className="hover:underline text-primary"
                        >
                          {dispute.id}
                        </Link>
                      </TableCell>
                      <TableCell>{dispute.renterId}</TableCell>
                      <TableCell>
                        <Badge>{dispute.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {dispute.createdAt ? format(dispute.createdAt.toDate(), 'PPP') : 'N/A'}
                      </TableCell>
                      <TableCell>
                         {dispute.slaDueAt ? format(dispute.slaDueAt.toDate(), 'PPP') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
           {!loading && disputes.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              No disputes found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
