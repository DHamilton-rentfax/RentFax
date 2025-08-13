'use client';
import { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';
import Protected from '@/components/protected';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function AuditAdminPage() {
  const { claims } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState('');

  const companyId = claims?.companyId;

  const load = async (next = false) => {
    if (!companyId) return;
    
    next ? setLoadingMore(true) : setLoading(true);

    const baseQueryParts = [
      where('companyId', '==', companyId),
      orderBy('at', 'desc'),
      limit(50),
    ];
    
    const q = next && cursor 
      ? query(collection(db, 'auditLogs'), ...baseQueryParts, startAfter(cursor))
      : query(collection(db, 'auditLogs'), ...baseQueryParts);
      
    const snap = await getDocs(q);
    const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    
    setItems(next ? [...items, ...docs] : docs);
    setCursor(snap.docs[snap.docs.length - 1] || null);
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    if (companyId) {
      load(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const filtered = filter
    ? items.filter(
        (x) =>
          (x.targetPath || '').toLowerCase().includes(filter.toLowerCase()) ||
          (x.action || '').toLowerCase().includes(filter.toLowerCase()) ||
          (x.actorUid || '').toLowerCase().includes(filter.toLowerCase())
      )
    : items;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-headline">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Company Audit Trail</CardTitle>
          <CardDescription>
            Review all actions taken within your company account.
          </CardDescription>
           <Input
            className="max-w-sm"
            placeholder="Filter by action, target, or user ID..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor UID</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  </TableRow>
                ))
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      {r.at?.toDate ? format(r.at.toDate(), 'PPpp') : ''}
                    </TableCell>
                    <TableCell className="font-mono text-xs">{r.actorUid}</TableCell>
                    <TableCell>{r.actorRole}</TableCell>
                    <TableCell className="font-medium">{r.action}</TableCell>
                    <TableCell className="font-mono text-xs truncate max-w-sm">{r.targetPath}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {!loading && filtered.length === 0 && (
              <div className="text-center p-8 text-muted-foreground">
              No audit logs found for the current filter.
              </div>
          )}
          {cursor && (
            <div className="pt-4 flex justify-center">
              <Button onClick={() => load(true)} disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
