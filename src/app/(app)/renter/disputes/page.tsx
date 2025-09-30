'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/firebase/client';
import Link from 'next/link';

type Dispute = {
  id: string;
  incidentId: string;
  description: string;
  evidenceUrls: string[];
  status: string;
  adminNotes?: string;
  createdAt: any;
};

export default function DisputeHistoryPage() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDisputes = async () => {
      const q = query(collection(db, 'disputes'), where('renterUid', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Dispute[];
      setDisputes(data);
      setLoading(false);
    };

    fetchDisputes();
  }, [user]);

  if (!user) return <p>Please log in to view your disputes.</p>;
  if (loading) return <p>Loading your dispute history...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Dispute History</h1>
      {disputes.length === 0 ? (
        <p>You haven’t submitted any disputes yet.</p>
      ) : (
        <ul className="space-y-4">
          {disputes.map(d => (
            <li key={d.id} className="border p-4 rounded shadow-sm bg-white">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Incident:{' '}
                    <Link
                      href={`/renter/incidents/${d.incidentId}`}
                      className="underline text-blue-600"
                    >
                      View Incident
                    </Link>
                  </p>
                  <p className="font-medium">Status: {d.status}</p>
                  <p className="mt-2">{d.description}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  {new Date(d.createdAt?.seconds * 1000).toLocaleDateString()}
                </div>
              </div>

              {d.evidenceUrls?.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Evidence:</p>
                  <ul className="list-disc list-inside">
                    {d.evidenceUrls.map((url, i) => (
                      <li key={i}>
                        <a href={url} target="_blank" className="text-blue-600 underline">
                          View File {i + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {d.adminNotes && (
                <div className="mt-2 bg-yellow-50 p-2 rounded text-sm text-gray-800">
                  <p className="font-semibold">Admin Notes:</p>
                  <p>{d.adminNotes}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
