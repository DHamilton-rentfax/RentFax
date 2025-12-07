'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function RenterTable() {
  const [renters, setRenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRenters = async () => {
      try {
        const q = query(collection(db, 'renters'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const rentersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRenters(rentersData);
      } catch (error) {
        console.error("Failed to fetch renters:", error);
      }
      setLoading(false);
    };

    fetchRenters();
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renters.map(renter => (
              <TableRow key={renter.id}>
                <TableCell className="font-medium">{renter.firstName} {renter.lastName}</TableCell>
                <TableCell>{renter.email}</TableCell>
                <TableCell>{renter.phone}</TableCell>
                <TableCell>{new Date(renter.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/renters/${renter.id}`} className="text-blue-600 hover:underline">
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
