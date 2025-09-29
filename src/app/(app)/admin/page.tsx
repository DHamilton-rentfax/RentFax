// src/app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/firebase/client';

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    renters: 0,
    incidents: 0,
    disputes: 0,
    auditLogs: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      const rentersSnap = await getCountFromServer(collection(db, 'renters'));
      const incidentsSnap = await getCountFromServer(collection(db, 'incidents'));
      const disputesSnap = await getCountFromServer(collection(db, 'disputes'));
      const auditSnap = await getCountFromServer(collection(db, 'auditLogs'));

      setStats({
        renters: rentersSnap.data().count,
        incidents: incidentsSnap.data().count,
        disputes: disputesSnap.data().count,
        auditLogs: auditSnap.data().count,
      });
    }

    fetchCounts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Renters" value={stats.renters} />
        <StatCard label="Incidents Reported" value={stats.incidents} />
        <StatCard label="Disputes" value={stats.disputes} />
        <StatCard label="Audit Logs" value={stats.auditLogs} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 shadow rounded">
      <p className="text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
