'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import {
  collection,
  orderBy,
  query,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Table } from './ui/Table';
import Loader from './ui/Loader';
import CompanyLink from '@/components/dashboard/CompanyLink';

export default function AuditLogViewer({ role }: { role: 'client' | 'admin' }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user && role !== 'admin') return;

    const baseQuery = query(
      collection(db, 'auditLogs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(baseQuery, (snap) => {
      const allLogs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLogs(
        role === 'admin'
          ? allLogs
          : allLogs.filter((l) => l.userId === user?.uid)
      );
      setLoading(false);
    });

    return () => unsub();
  }, [user, role]);

  if (loading) return <Loader />;

  const headers = ['Event', 'User / Company', 'Details', 'Timestamp'];
  const rows = logs.map((log) => [
    log.type,
    log.filedByUserId ? (
      <CompanyLink
        companyId={log.filedByUserId}
        companyName={log.filedByName}
      />
    ) : (
      log.email || 'System'
    ),
    log.description || '—',
    new Date(log.timestamp.seconds * 1000).toLocaleString(),
  ]);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Audit Log</h3>
      <Table headers={headers} rows={rows} />
    </div>
  );
}
