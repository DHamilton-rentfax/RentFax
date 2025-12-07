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
} from 'firebase/firestore';
import { db } from '@/firebase/client';

import { Card } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import ReportIdentitySection from '@/components/reports/ReportIdentitySection';

export default function RenterDetailPage() {
  const params = useParams();
  const renterId = params?.renterId as string;

  const [renter, setRenter] = useState<any>(null);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [identity, setIdentity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renterId) return;

    const load = async () => {
      setLoading(true);

      // Renter profile
      const renterSnap = await getDoc(doc(db, 'renterProfiles', renterId));
      if (renterSnap.exists()) setRenter(renterSnap.data());

      // Identity verification record
      const identitySnap = await getDoc(
        doc(db, 'identityChecks', renterId)
      );
      if (identitySnap.exists()) setIdentity(identitySnap.data());

      // Incidents
      const incidentsSnap = await getDocs(
        query(
          collection(db, 'incidents'),
          where('renterId', '==', renterId),
          orderBy('createdAt', 'desc')
        )
      );
      setIncidents(incidentsSnap.docs.map((d) => d.data()));

      // Disputes
      const disputesSnap = await getDocs(
        query(
          collection(db, 'disputes'),
          where('renterId', '==', renterId),
          orderBy('createdAt', 'desc')
        )
      );
      setDisputes(disputesSnap.docs.map((d) => d.data()));

      setLoading(false);
    };

    load();
  }, [renterId]);

  if (loading)
    return (
      <div className='flex justify-center py-20'>
        <Loader2 className='h-10 w-10 animate-spin text-blue-600' />
      </div>
    );

  if (!renter)
    return (
      <div className='text-center text-gray-500 py-10'>
        Renter not found.
      </div>
    );

  return (
    <div className='space-y-10 pb-20'>
      {/* HEADER */}
      <Card className='p-6'>
        <h1 className='text-2xl font-bold text-[#1A2540]'>
          {renter.name ?? 'Unnamed Renter'}
        </h1>

        <p className='text-gray-600'>
          {renter.emails?.[0] ?? renter.email ?? 'No email'}
        </p>

        <p className='text-sm text-gray-500'>
          Status:{' '}
          <span
            className={`capitalize font-semibold ${
              renter.alert ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {renter.status ?? (renter.alert ? 'Flagged' : 'Unknown')}
          </span>
        </p>

        <p className='text-sm text-gray-500'>
          Risk Score:{' '}
          <span className='font-semibold'>
            {renter.riskScore ?? 'N/A'}
          </span>
        </p>
      </Card>

      {/* IDENTITY */}
      {identity && (
        <Card className='p-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Identity Verification
          </h2>

          <ReportIdentitySection
            renter={renter}
            matchScore={identity.matchScore}
            fraudSignals={identity.fraudSignals ?? {}}
          />
        </Card>
      )}

      {/* INCIDENTS */}
      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Incidents</h2>

        {incidents.length === 0 ? (
          <p className='text-gray-500'>No incidents found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {incidents.map((inc, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Link
                      href={`/dashboard/incidents/${inc.id}`}
                      className='text-blue-600 hover:underline'
                    >
                      {inc.description ?? 'Incident'}
                    </Link>
                  </TableCell>

                  <TableCell className='capitalize'>
                    {inc.status ?? 'unknown'}
                  </TableCell>

                  <TableCell>
                    {inc.createdAt?.seconds
                      ? new Date(
                          inc.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* DISPUTES */}
      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Disputes</h2>

        {disputes.length === 0 ? (
          <p className='text-gray-500'>No disputes submitted.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {disputes.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.incidentId ?? 'N/A'}</TableCell>

                  <TableCell className='capitalize'>
                    {d.status ?? 'unknown'}
                  </TableCell>

                  <TableCell>
                    {d.createdAt?.seconds
                      ? new Date(
                          d.createdAt.seconds * 1000
                        ).toLocaleDateString()
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
