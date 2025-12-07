'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export function CompanyTable() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const q = query(collection(db, 'companies'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const companiesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCompanies(companiesData);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
      setLoading(false);
    };

    fetchCompanies();
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
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map(company => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell>
                  <Badge variant={company.verified ? 'default' : 'secondary'}>
                    {company.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                 <TableCell className="text-right">
                  <Link href={`/admin/companies/${company.id}`} className="text-blue-600 hover:underline">
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
