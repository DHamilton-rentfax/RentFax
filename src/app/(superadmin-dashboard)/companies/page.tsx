'use client';

import { useEffect, useState, useMemo } from 'react';
import { db } from '@/firebase/client';
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { Card } from '@/components/dashboard/ui/Card';
import { Table } from '@/components/dashboard/ui/Table';
import { Building2, Search, Filter, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Loader from '@/components/dashboard/ui/Loader';

export default function CompanyDirectoryPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [filterType, setFilterType] = useState('all'); // New state for business type

  useEffect(() => {
    async function fetchCompanies() {
      setLoading(true);
      const q = query(collection(db, 'companies'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setCompanies(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase());
      
      const matchesPlan =
        filterPlan === 'all' || c.planType === filterPlan;
        
      const matchesVerification = 
        filterVerification === 'all' || 
        (filterVerification === 'verified' && c.verified) || 
        (filterVerification === 'unverified' && !c.verified);

      // Logic for business type filter
      const matchesType = 
        filterType === 'all' || (c.businessType || 'property') === filterType;
        
      return matchesSearch && matchesPlan && matchesVerification && matchesType;
    });
  }, [companies, search, filterPlan, filterVerification, filterType]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#1A2540]" />
            <h2 className="text-xl font-semibold text-gray-800">
              Registered Companies
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-2.5 text-gray-500" />
              <Input
                placeholder="Search by name or email..."
                className="pl-8 w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Business Type Filter */}
            <select
              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm h-9"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="property">Property</option>
              <option value="vehicle">Vehicle</option>
              <option value="equipment">Equipment</option>
            </select>

            <select
              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm h-9"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
            
            <select
              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm h-9"
              value={filterVerification}
              onChange={(e) => setFilterVerification(e.target.value)}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSearch('');
                setFilterPlan('all');
                setFilterVerification('all');
                setFilterType('all'); // Reset business type filter
              }}
            >
              <Filter className="h-4 w-4 mr-1" /> Clear Filters
            </Button>
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <p className="text-sm text-gray-500 p-4 text-center">
            No companies found matching your criteria.
          </p>
        ) : (
          <Table
            headers={[
              'Company Name',
              'Business Type',
              'Plan',
              'Verification',
              'Status',
              'Action',
            ]}
            rows={filteredCompanies.map((c) => [
              <Link
                href={`/admin/companies/${c.id}`}
                className="text-blue-600 hover:underline font-medium"
                key={c.id}
              >
                {c.name ?? '—'}
              </Link>,
              <span key={`${c.id}-type`} className="capitalize">
                {c.businessType ?? 'Property'}
              </span>,
              <span
                key={`${c.id}-plan`}
                className={`capitalize`}
              >
                {c.planType ?? 'Free'}
              </span>,
              c.verified ? (
                <span key={`${c.id}-verified`} className="flex items-center gap-1 text-green-600 text-xs font-medium">
                  <ShieldCheck className="h-4 w-4" /> Verified
                </span>
              ) : (
                <span key={`${c.id}-unverified`} className="text-xs text-yellow-600">Unverified</span>
              ),
              c.isSuspended ? (
                <span key={`${c.id}-suspended`} className="text-red-500">Suspended</span>
              ) : (
                <span key={`${c.id}-active`} className="text-green-500">Active</span>
              ),
              <Link
                href={`/admin/companies/${c.id}`}
                className="text-sm px-3 py-1 rounded-md bg-[#1A2540] text-white hover:bg-[#2a3660]"
                key={`${c.id}-action`}
              >
                View
              </Link>,
            ])}
          />
        )}
      </Card>
    </div>
  );
}
