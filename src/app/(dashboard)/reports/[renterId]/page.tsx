'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RenterSummaryPage({
  params,
}: {
  params: { renterId: string };
}) {
  const { renterId } = params;
  const [loading, setLoading] = useState(true);
  const [renter, setRenter] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('Generating summary...');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ renter profile
        const renterSnap = await getDoc(doc(db, 'renterProfiles', renterId));
        if (renterSnap.exists()) setRenter(renterSnap.data());

        // 2️⃣ reports
        const reportsQ = query(
          collection(db, 'renterReports'),
          where('renterRef', '==', renterId),
          orderBy('verifiedAt', 'desc')
        );
        const reportsSnap = await getDocs(reportsQ);
        setReports(reportsSnap.docs.map((d) => d.data()));

        // 3️⃣ reviews
        const reviewsQ = query(
          collection(db, 'rentalReviews'),
          where('renterRef', '==', renterId),
          orderBy('createdAt', 'desc')
        );
        const reviewsSnap = await getDocs(reviewsQ);
        setReviews(reviewsSnap.docs.map((d) => d.data()));

        // 4️⃣ incidents
        const incidentsQ = query(
          collection(db, 'incidents'),
          where('renterRef', '==', renterId),
          orderBy('createdAt', 'desc')
        );
        const incidentsSnap = await getDocs(incidentsQ);
        setIncidents(incidentsSnap.docs.map((d) => d.data()));
      } catch (err) {
        console.error('Failed to load renter summary:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Fetch AI Summary
    fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ renterId }),
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) setAiSummary(data.summary);
        else setAiSummary('Could not generate summary.');
    })
    .catch(() => setAiSummary('Error retrieving summary.'));

  }, [renterId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );

  if (!renter)
    return (
      <div className="p-8 text-center">
        <p>No renter record found.</p>
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="border-b pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{renter.name}</h1>
          <p className="text-sm text-gray-500">{renter.emails?.[0]}</p>
        </div>
        <Button asChild>
          <Link href={`/dashboard/rentals/end?renterId=${renterId}`}>
            Add Review
          </Link>
        </Button>
      </header>

      {/* Overview cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-1">Behavior Score</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {renter.behaviorScore ?? '—'}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-1">Risk Score</h3>
          <p className="text-3xl font-bold text-red-500">
            {renter.riskScore ?? '—'}
          </p>
        </div>
        <div className="p-4 bg-white rounded shadow">
          <h3 className="font-medium mb-1">Last Verified</h3>
          <p>{renter.lastVerified?.toDate?.().toLocaleDateString() ?? '—'}</p>
        </div>
      </div>

      {/* AI Summary Section */}
        <section className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold mb-2">AI Summary</h2>
            <p className="text-gray-700 whitespace-pre-line">{aiSummary}</p>
        </section>


      {/* Reports */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Verification Reports</h2>
        <div className="space-y-2">
          {reports.length === 0 ? (
            <p className="text-sm text-gray-500">No reports yet.</p>
          ) : (
            reports.map((r, i) => (
              <div key={i} className="p-3 border rounded bg-white">
                <p>
                  <b>Type:</b> {r.type} &nbsp;|&nbsp;
                  <b>Date:</b>{" "}
                  {r.verifiedAt?.toDate?.().toLocaleDateString() ?? '—'}
                </p>
                <p className="text-sm text-gray-500">{r.notes}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Reviews */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Behavior Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews submitted yet.</p>
        ) : (
          <ul className="space-y-2">
            {reviews.map((r, i) => (
              <li key={i} className="border p-3 rounded bg-white">
                <p>
                  <b>Cleanliness:</b> {r.cleanlinessScore} &nbsp;|&nbsp;
                  <b>Timeliness:</b> {r.timelinessScore} &nbsp;|&nbsp;
                  <b>Communication:</b> {r.communicationScore}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {r.comments || 'No comments'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Incidents */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Reported Incidents</h2>
        {incidents.length === 0 ? (
          <p className="text-sm text-gray-500">No incidents on record.</p>
        ) : (
          <ul className="space-y-2">
            {incidents.map((i, idx) => (
              <li key={idx} className="border p-3 rounded bg-white">
                <p className="font-medium">{i.title || 'Incident'}</p>
                <p className="text-sm text-gray-600">{i.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
