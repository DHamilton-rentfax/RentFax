'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPortalSession } from '@/firebase/server-actions/stripe';
import Papa from 'papaparse';

export default function SubscriptionDashboard() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('all');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSubscriptions() {
      setLoading(true);
      let q: any = collection(db, 'subscriptions'); // Using 'any' to allow for dynamic query building
      const filters = [];

      if (plan !== 'all') filters.push(where('planId', '==', plan));
      if (status !== 'all') filters.push(where('status', '==', status));

      if (filters.length > 0) {
        q = query(q, ...filters);
      }

      const snapshot = await getDocs(q);
      let results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (search) {
        results = results.filter(sub =>
          sub.customerName?.toLowerCase().includes(search.toLowerCase()) ||
          sub.customerEmail?.toLowerCase().includes(search.toLowerCase())
        );
      }

      setSubscriptions(results);
      setLoading(false);
    }

    fetchSubscriptions();
  }, [plan, status, search]);

  const openStripePortal = async (customerId: string) => {
    try {
        const session = await createPortalSession(customerId);
        if (session?.url) {
            window.open(session.url, '_blank');
        }
    } catch (error) {
        console.error("Error creating portal session:", error);
    }
  };

  const handleExport = () => {
    const csvData = subscriptions.map(sub => ({
        'Customer Name': sub.customerName,
        'Email': sub.customerEmail,
        'Plan': sub.planId,
        'Status': sub.status,
        'Stripe Customer ID': sub.customerId,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'subscriptions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Subscriptions</h1>
            <Button variant="outline" onClick={handleExport} disabled={subscriptions.length === 0}>
                Export to CSV
            </Button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search by company or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2"
        />

        <Select value={plan} onValueChange={setPlan}>
            <SelectTrigger>
                <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="unlimited">Unlimited</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
                <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="past_due">Past Due</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded shadow-sm border divide-y">
        {loading ? (
          <div className="p-4 text-center">Loading subscriptions...</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No results found.</div>
        ) : (
          subscriptions.map((sub) => (
            <div key={sub.id} className="p-4 flex justify-between items-center">
              <div>
                <div className="font-medium">{sub.customerName || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">{sub.customerEmail}</div>
                <div className="text-xs text-muted-foreground">Plan: {sub.planId} / Status: {sub.status}</div>
              </div>
              <Button variant="outline" onClick={() => openStripePortal(sub.customerId)}>
                Manage
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
