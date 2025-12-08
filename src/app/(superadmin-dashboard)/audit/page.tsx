'use client';

import { useEffect, useState } from 'react';
import ActivityTable from './ActivityTable';
import SuspiciousActivity from './SuspiciousActivity';
import EmployeeStats from './EmployeeStats';
import AIAnomalyInsights from './AIAnomalyInsights';

export default function SuperAdminAuditPage() {
  const [activity, setActivity] = useState([]);
  const [suspicious, setSuspicious] = useState([]);
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    async function load() {
      const a = await fetch('/api/superadmin/audit/activity').then((r) =>
        r.json()
      );
      const s = await fetch('/api/superadmin/audit/suspicious').then((r) =>
        r.json()
      );
      const n = await fetch('/api/superadmin/audit/anomalies').then((r) =>
        r.json()
      );

      setActivity(a.logs || []);
      setSuspicious(s.suspicious || []);
      setAnomalies(n.insights || []);
    }

    load();
  }, []);

  return (
    <div className='space-y-10 pb-32'>
      <h1 className='text-2xl font-bold'>Audit & Employee Oversight</h1>
      <p className='text-gray-600'>
        Monitor system-wide behavior, risk, anomalies & employee actions.
      </p>

      <EmployeeStats activity={activity} />

      <SuspiciousActivity logs={suspicious} />

      <AIAnomalyInsights insights={anomalies} />

      <ActivityTable logs={activity} />
    </div>
  );
}
