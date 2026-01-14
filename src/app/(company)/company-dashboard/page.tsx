'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { Card } from '@/components/dashboard/ui/Card';
import { Table } from '@/components/dashboard/ui/Table';
import { Button } from '@/components/ui/button';
import { Loader2, User2, FileText, DollarSign, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<any>(null);
  const [renters, setRenters] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // If user is not logged in after a delay, stop loading.
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    async function fetchData() {
      try {
        // The user ID should correspond to the company document ID
        const companyRef = doc(db, 'companies', user.uid);
        const snap = await getDoc(companyRef);

        if (snap.exists()) {
          const companyData = { id: snap.id, ...snap.data() };
          setCompany(companyData);

          // Fetch renters linked to this company
          const rentersQuery = query(
            collection(db, 'renterProfiles'),
            where('createdBy', '==', user.uid)
          );
          const rentersSnap = await getDocs(rentersQuery);
          setRenters(rentersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

          // Fetch disputes filed by this company
          const disputesQuery = query(
            collection(db, 'disputes'),
            where('filedByUserId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
          const disputesSnap = await getDocs(disputesQuery);
          setDisputes(disputesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        } else {
          console.log('No company profile found for user:', user.uid);
        }
      } catch (error) {
        console.error('Error fetching company dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  if (!company)
    return (
      <div className="text-center py-20 text-gray-600">
        <h2 class="text-xl font-semibold mb-2">Welcome to RentFAX</h2>
        <p>Your company profile is not yet complete.</p>
        <br />
        <Link href="/dashboard/settings" className="text-blue-600 hover:underline">
          <Button>Complete Your Profile Setup</Button>
        </Link>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2540]">
            Welcome, {company.name || 'Your Company'}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Plan: {company.planType ?? 'Free'} • Type:{' '}
            {company.businessType ?? 'Property'}
          </p>
          {company.verified ? (
            <div className="flex items-center gap-1 text-green-700 mt-1">
              <ShieldCheck className="h-4 w-4" /> Verified Business
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600 mt-1">
              <ShieldCheck className="h-4 w-4 opacity-50" /> Pending Verification
            </div>
          )}
        </div>
        <Button
          onClick={() => (window.location.href = '/dashboard/settings')}
          variant="outline"
          size="sm"
        >
          Edit Profile
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h4 className="text-sm text-gray-600">Total Renters</h4>
          <p className="text-2xl font-semibold text-[#1A2540]">{renters.length}</p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm text-gray-600">Open Disputes</h4>
          <p className="text-2xl font-semibold text-[#1A2540]">
            {disputes.filter((d) => d.status !== 'resolved').length}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm text-gray-600">Risk Alerts</h4>
          <p
            className={`text-2xl font-semibold ${
              company.riskScore > 75
                ? 'text-red-600'
                : company.riskScore > 40
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {company.riskScore ?? 'N/A'}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm text-gray-600">Credit Balance</h4>
          <p className="text-2xl font-semibold text-[#1A2540]">
            {company.remainingCredits ?? 0}
          </p>
        </Card>
      </div>

      {/* Renters Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1A2540]">Your Renters</h3>
          <Link
            href="/dashboard/reports"
            className="text-blue-600 text-sm hover:underline"
          >
            Manage Reports
          </Link>
        </div>

        {renters.length === 0 ? (
          <p className="text-gray-500 text-sm">No renters added yet.</p>
        ) : (
          <Table
            headers={['Name', 'Email', 'Status', 'Risk']}
            rows={renters.map((r) => [
              r.name,
              r.emails?.[0] ?? r.email, 
              <span
                key={`${r.id}-status`}
                className={`capitalize ${
                  r.status === 'flagged' || r.alert
                    ? 'text-red-600'
                    : r.status === 'verified'
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}
              >
                {r.status ?? (r.alert ? 'Flagged' : 'Unknown')}
              </span>,
              <span key={`${r.id}-risk`} className="font-medium">{r.riskScore ?? 'N/A'}</span>,
            ])}
          />
        )}
        <Button
          size="sm"
          className="mt-4"
          onClick={() =>
            (window.location.href = '/dashboard/reports/new')
          }
        >
          + Add New Renter
        </Button>
      </Card>

      {/* Disputes Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1A2540]">Disputes</h3>
          <Link
            href="/dashboard/disputes"
            className="text-blue-600 text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        {disputes.length === 0 ? (
          <p className="text-gray-500 text-sm">No disputes filed.</p>
        ) : (
          <Table
            headers={['Renter', 'Amount', 'Status', 'Date']}
            rows={disputes.map((d) => [
              d.renterName,
              d.amount ? `$${d.amount}` : '—',
              <span
                key={`${d.id}-status`}
                className={`capitalize ${
                  d.status === 'resolved'
                    ? 'text-green-600'
                    : d.status === 'pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {d.status}
              </span>,
              new Date(d.createdAt?.seconds * 1000).toLocaleDateString(),
            ])}
          />
        )}
        <Button
          size="sm"
          className="mt-4"
          onClick={() =>
            (window.location.href = '/dashboard/disputes/new')
          }
        >
          + File New Dispute
        </Button>
      </Card>

      {/* Billing Section */}
      <Card className="p-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1A2540] mb-1">
              Billing & Subscription
            </h3>
            <p className="text-sm text-gray-600">
              Manage your plan, invoices, and credit balance.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              alert('Stripe Billing Portal will be integrated here.')
            }
          >
            Open Billing Portal
          </Button>
        </div>
      </Card>
    </div>
  );
}
