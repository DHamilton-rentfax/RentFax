'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/firebase/client';

import ReminderForm from '../components/ReminderForm';
import TrendChart from '../components/TrendChart';

export default function ComplianceRemindersPage() {
  const [nonCompliantUsers, setNonCompliantUsers] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const userSnap = await getDocs(collection(db, 'users'));
      const users = userSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNonCompliantUsers(users.filter((u) => u.complianceStatus === 'non_compliant'));

      const trendSnap = await getDocs(collection(db, 'complianceTrends'));
      const trends = trendSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTrendData(trends.sort((a, b) => a.date - b.date));

      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading compliance reminders...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#1A2540]">Compliance Reminders</h1>
      <p className="text-gray-600">Send reminders to users who have not yet acknowledged required policies.</p>

      <ReminderForm users={nonCompliantUsers} />

      <TrendChart trends={trendData} />
    </div>
  );
}
