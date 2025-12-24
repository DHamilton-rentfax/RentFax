'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/firebase/client';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { Card } from '@/components/dashboard/ui/Card';
import { Table } from '@/components/dashboard/ui/Table';
import { Loader2, ShieldCheck, XCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { VerifyCompanyPanel } from '@/components/dashboard/VerifyCompanyPanel';

export default function AdminCompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [company, setCompany] = useState<any>(null);
  const [renters, setRenters] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const companyRef = doc(db, 'companies', id);
      const snap = await getDoc(companyRef);

      if (snap.exists()) {
        const companyData = { id: snap.id, ...snap.data() };
        setCompany(companyData);

        // Fetch renters created by this company
        const rentersQuery = query(
          collection(db, 'renterProfiles'),
          where('createdBy', '==', id)
        );
        const rentersSnap = await getDocs(rentersQuery);
        setRenters(rentersSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Fetch disputes filed by this company
        const disputesQuery = query(
          collection(db, 'disputes'),
          where('filedByUserId', '==', id),
          orderBy('createdAt', 'desc')
        );
        const disputesSnap = await getDocs(disputesQuery);
        setDisputes(disputesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } else {
        setCompany(null);
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const handleCompanyUpdate = () => {
    // Refetch all data to ensure UI is consistent
    fetchCompanyData();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  if (!company)
    return (
      <div className="text-center py-10 text-gray-500">
        Company not found or has been deleted.
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#1A2540]" />
            <h1 className="text-2xl font-bold text-[#1A2540]">
              {company.name}
            </h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {company.email} • {company.phone ?? 'No phone'} •{' '}
            {company.country ?? 'Unknown'}
          </p>
          <p className="text-xs text-gray-500">
            Plan: {company.planType ?? 'Free'} • Joined{' '}
            {company.createdAt
              ? new Date(company.createdAt.seconds * 1000).toLocaleDateString()
              : 'Unknown'}
          </p>
        </div>

        {/* Verification Panel */}
        <VerifyCompanyPanel company={company} onUpdate={handleCompanyUpdate} />
      </div>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-600">Total Renters</h4>
          <p className="text-2xl font-semibold text-[#1A2540]">
            {renters.length}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-600">Disputes Filed</h4>
          <p className="text-2xl font-semibold text-[#1A2540]">
            {disputes.length}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-600">
            Current Plan
          </h4>
          <p className="text-xl font-semibold capitalize text-[#1A2540]">
            {company.planType ?? 'Free'}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-600">Risk Score</h4>
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
      </div>

      {/* Linked Renters */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1A2540]">
            Renters Managed by {company.name}
          </h3>
          <Link
            href={`/admin/renters?company=${company.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
        {renters.length === 0 ? (
          <p className="text-gray-500 text-sm">No renters found.</p>
        ) : (
          <Table
            headers={['Renter Name', 'Email', 'Status', 'Risk']}
            rows={renters.map((r) => [
              <Link
                href={`/admin/renters/${r.id}`}
                className="text-blue-600 hover:underline"
                key={r.id}
              >
                {r.name}
              </Link>,
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
              <span key={`${r.id}-risk`} className="font-medium">
                {r.riskScore ? `${r.riskScore}/100` : 'N/A'}
              </span>,
            ])}
          />
        )}
      </Card>

      {/* Disputes */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#1A2540]">
            Disputes Filed by {company.name}
          </h3>
          <Link
            href={`/admin/disputes?company=${company.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>
        </div>
        {disputes.length === 0 ? (
          <p className="text-gray-500 text-sm">No disputes filed yet.</p>
        ) : (
          <Table
            headers={['Renter', 'Amount', 'Status', 'Date']}
            rows={disputes.map((d) => [
              <Link
                href={`/admin/disputes/${d.id}`}
                className="text-blue-600 hover:underline"
                key={d.id}>
                {d.renterName ?? 'Unknown'}
              </Link>,
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
                {d.status ?? 'unknown'}
              </span>,
              new Date(d.createdAt?.seconds * 1000).toLocaleDateString(),
            ])}
          />
        )}
      </Card>

      {/* Billing Section (coming soon, placeholder) */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-[#1A2540] mb-2">
          Billing & Subscription
        </h3>
        <p className="text-sm text-gray-600">
          Stripe integration linked to company email:
          <br />
          <span className="font-medium">{company.email}</span>
        </p>
        <Button
          size="sm"
          className="mt-3"
          onClick={() =>
            alert('Stripe customer portal integration coming soon.')
          }
        >
          Open Billing Portal
        </Button>
      </Card>
    </div>
  );
}
