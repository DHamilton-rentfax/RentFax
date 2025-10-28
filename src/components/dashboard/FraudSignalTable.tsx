'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Card } from './ui/Card';
import { Table } from './ui/Table';
import Loader from './ui/Loader';
import { AlertTriangle } from 'lucide-react';
import CompanyLink from '@/components/dashboard/CompanyLink';

export default function FraudSignalTable() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'fraudSignals'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSignals(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <Loader />;

  const headers = ['Renter', 'Type', 'Value', 'Count', 'Status', 'Filed By'];
  const rows = signals.map((s) => [
    s.renterName ?? '—',
    s.type,
    s.value,
    s.count ?? 0,
    s.resolved ? (
      <span className="text-green-600 font-medium">Cleared</span>
    ) : (
      <span className="text-red-600 font-medium">Active</span>
    ),
    s.filedByUserId ? (
      <CompanyLink companyId={s.filedByUserId} companyName={s.filedByName} />
    ) : (
      '—'
    ),
  ]);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        Fraud Signal Log
      </h3>
      <Table headers={headers} rows={rows} />
    </Card>
  );
}
