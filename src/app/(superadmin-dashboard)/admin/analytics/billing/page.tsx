'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { AnalyticsCard } from '@/components/admin/AnalyticsCard';

export default function AdminBillingPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const historyCollection = collection(db, 'billingHistory');
      const historySnapshot = await getDocs(historyCollection);
      const historyList = historySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHistory(historyList);
      setLoading(false);
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div>Loading billing data...</div>;
  }

  const totalIdentityChecks = history.filter(h => h.purchaseType === "identity-check").length;
  const totalReports = history.filter(h => h.purchaseType === "full-report").length;
  const revenue = history.reduce((sum, h) => sum + h.amount, 0) / 100; // Assuming amount is in cents

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard title="Total Revenue" value={`$${revenue.toFixed(2)}`} />
        <AnalyticsCard title="Identity Checks Sold" value={totalIdentityChecks} />
        <AnalyticsCard title="Reports Purchased" value={totalReports} />
      </div>
    </div>
  );
}
