'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { Loader2, Building2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/firebase/client';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { VerifyCompanyPanel } from '@/components/admin/dashboard/VerifyCompanyPanel';

// ✅ Proper type for Firestore timestamp optional
interface TimestampLike {
  seconds?: number;
  nanoseconds?: number;
}

// ✅ Stronger data interfaces for readability
interface CompanyData extends DocumentData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  planType?: string;
  riskScore?: number;
  createdAt?: TimestampLike;
}

interface RenterData extends DocumentData {
  id: string;
  name?: string;
  email?: string;
  emails?: string[];
  status?: string;
  alert?: boolean;
  riskScore?: number;
}

interface DisputeData extends DocumentData {
  id: string;
  renterName?: string;
  amount?: number;
  status?: string;
  createdAt?: TimestampLike;
}

export default function AdminCompanyDetailPage() {
  const params = useParams();
  const id = (params as { id?: string })?.id ?? null;

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [renters, setRenters] = useState<RenterData[]>([]);
  const [disputes, setDisputes] = useState<DisputeData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const companyRef = doc(db, 'companies', id);
      const snap = await getDoc(companyRef);

      if (snap.exists()) {
        const companyData = { id: snap.id, ...snap.data() } as CompanyData;
        setCompany(companyData);

        // ✅ Renters created by this company
        const rentersQuery = query(
          collection(db, 'renterProfiles'),
          where('createdBy', '==', id)
        );
        const rentersSnap = await getDocs(rentersQuery);
        setRenters(
          rentersSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as RenterData)
          )
        );

        // ✅ Disputes filed by this company
        const disputesQuery = query(
          collection(db, 'disputes'),
          where('filedByUserId', '==', id),
          orderBy('createdAt', 'desc')
        );
        const disputesSnap = await getDocs(disputesQuery);
        setDisputes(
          disputesSnap.docs.map(
            (d) => ({ id: d.id, ...d.data() } as DisputeData)
          )
        );
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
    if (id) fetchCompanyData();
  }, [id]);

  const handleCompanyUpdate = () => fetchCompanyData();

  // ✅ Loading spinner
  if (loading)
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  // ✅ Graceful null fallback
  if (!company)
    return (
      <div className="text-center py-10 text-gray-500">
        Company not found or has been deleted.
      </div>
    );

  // ✅ Helper to format timestamps safely
  const formatDate = (ts?: TimestampLike) => {
    if (!ts?.seconds) return 'Unknown';
    return new Date(ts.seconds * 1000).toLocaleDateString();
  };

  const plan = company.planType ?? 'Free';

  return (
    <div className="space-y-8">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#1A2540]" />
            <h1 className="text-2xl font-bold text-[#1A2540]">
              {company.name ?? 'Unnamed Company'}
            </h1>
          </div>
          <p className="text-gray-600 text-sm mt-1">
            {company.email ?? 'No email'} • {company.phone ?? 'No phone'} •{' '}
            {company.country ?? 'Unknown'}
          </p>
          <p className="text-xs text-gray-500">
            Plan: {plan} • Joined {formatDate(company.createdAt)}
          </p>
        </div>

        {/* --- Verification Panel --- */}
        <VerifyCompanyPanel company={company} onUpdate={handleCompanyUpdate} />
      </div>

      {/* --- OVERVIEW CARDS --- */}
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
          <h4 className="text-sm font-medium text-gray-600">Current Plan</h4>
          <p className="text-xl font-semibold capitalize text-[#1A2540]">
            {plan}
          </p>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-600">Risk Score</h4>
          <p
            className={`text-2xl font-semibold ${
              (company.riskScore ?? 0) > 75
                ? 'text-red-600'
                : (company.riskScore ?? 0) > 40
                ? 'text-yellow-600'
                : 'text-green-600'
            }`}
          >
            {company.riskScore ?? 'N/A'}
          </p>
        </Card>
      </div>

      {/* --- LINKED RENTERS --- */}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renters.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <Link
                      href={`/admin/renters/${r.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {r.name ?? 'Unnamed'}
                    </Link>
                  </TableCell>
                  <TableCell>{r.emails?.[0] ?? r.email ?? '—'}</TableCell>
                  <TableCell>
                    <span
                      className={`capitalize ${
                        r.status === 'flagged' || r.alert
                          ? 'text-red-600'
                          : r.status === 'verified'
                          ? 'text-green-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {r.status ?? (r.alert ? 'Flagged' : 'Unknown')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {r.riskScore ? `${r.riskScore}/100` : 'N/A'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* --- DISPUTES --- */}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Renter</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <Link
                      href={`/admin/disputes/${d.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {d.renterName ?? 'Unknown'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {d.amount ? `$${d.amount}` : '—'}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`capitalize ${
                        d.status === 'resolved'
                          ? 'text-green-600'
                          : d.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {d.status ?? 'unknown'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(d.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* --- BILLING (Placeholder) --- */}
      <Card className="p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-[#1A2540] mb-2">
          Billing & Subscription
        </h3>
        <p className="text-sm text-gray-600">
          Stripe integration linked to company email:
          <br />
          <span className="font-medium">{company.email ?? 'No email'}</span>
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
