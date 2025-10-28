'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { Card } from './ui/Card';
import { Table } from './ui/Table';
import Loader from './ui/Loader';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import CompanyLink from '@/components/dashboard/CompanyLink';

export default function DisputeResolutionPanel() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'disputes'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDisputes(items);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, 'disputes', id), {
      status: newStatus,
      reviewedAt: new Date().toISOString(),
    });
  };

  if (loading) return <Loader />;

  const headers = ['Renter', 'Filed By', 'Incident', 'Status', 'Evidence', 'Action'];
  const rows = disputes.map((d) => [
    d.renterName,
    <CompanyLink companyId={d.filedByUserId} companyName={d.filedByName} />,
    d.incidentId ?? '—',
    <span
      className={`font-medium ${
        d.status === 'resolved'
          ? 'text-green-600'
          : d.status === 'pending'
          ? 'text-yellow-600'
          : 'text-red-600'
      }`}
    >
      {d.status}
    </span>,
    d.evidence?.length ?? 0,
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleStatusChange(d.id, 'resolved')}
      >
        <CheckCircle2 className="h-4 w-4 mr-1 text-green-600" /> Resolve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleStatusChange(d.id, 'rejected')}
      >
        <XCircle className="h-4 w-4 mr-1" /> Reject
      </Button>
    </div>,
  ]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Dispute Management
      </h3>
      {disputes.length === 0 ? (
        <p className="text-gray-500 text-sm">No disputes to review.</p>
      ) : (
        <Table headers={headers} rows={rows} />
      )}
    </Card>
  );
}
