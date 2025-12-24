'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Violation {
  id: string;
  userId: string;
  renterId: string;
  fileName: string;
  reason: string;
  hipaaViolation: boolean;
  piiViolation: boolean;
  createdAt: any; // Firestore timestamp
  autoBlocked: boolean;
  evidenceTextSnippet: string;
}

export default function ViolationsPage() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [filteredViolations, setFilteredViolations] = useState<Violation[]>([]);
  const [userFilter, setUserFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchViolations = async () => {
      const q = query(collection(db, 'violations'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const violationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Violation));
      setViolations(violationsData);
      setFilteredViolations(violationsData);
    };
    fetchViolations();
  }, []);

  useEffect(() => {
    let filtered = violations;

    if (userFilter) {
      filtered = filtered.filter(v => v.userId.includes(userFilter) || v.renterId.includes(userFilter));
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(v => {
        if (typeFilter === 'hipaa') return v.hipaaViolation;
        if (typeFilter === 'pii') return v.piiViolation;
        return true;
      });
    }

    setFilteredViolations(filtered);
  }, [userFilter, typeFilter, violations]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Violation Log</CardTitle>
        <div className="flex space-x-4 mt-4">
          <Input
            placeholder="Filter by User or Renter ID"
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="hipaa">HIPAA</SelectItem>
              <SelectItem value="pii">PII</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Renter ID</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredViolations.map(violation => (
              <TableRow key={violation.id}>
                <TableCell>{violation.userId}</TableCell>
                <TableCell>{violation.renterId}</TableCell>
                <TableCell>{violation.fileName}</TableCell>
                <TableCell>{violation.reason}</TableCell>
                <TableCell>
                  {violation.hipaaViolation && <Badge variant="destructive">HIPAA</Badge>}
                  {violation.piiViolation && <Badge variant="destructive">PII</Badge>}
                </TableCell>
                <TableCell>{new Date(violation.createdAt.seconds * 1000).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
