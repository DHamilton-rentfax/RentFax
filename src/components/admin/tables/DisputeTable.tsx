'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function DisputeTable() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const q = query(collection(db, 'disputes'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const disputesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDisputes(disputesData);
      } catch (error) {
        console.error("Failed to fetch disputes:", error);
      }
      setLoading(false);
    };

    fetchDisputes();
  }, []);

  return (
    <Card>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispute ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disputes.map(dispute => (
              <TableRow key={dispute.id}>
                <TableCell className="font-mono text-xs">{dispute.id}</TableCell>
                <TableCell>
                  <Badge variant={dispute.status === 'resolved' ? 'default' : 'secondary'}>
                    {dispute.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(dispute.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/disputes/${dispute.id}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
