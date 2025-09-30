'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import Link from 'next/link';

type Dispute = {
  id: string;
  incidentId: string;
  renterUid: string;
  description: string;
  evidenceUrls: string[];
  status: string;
  adminNotes?: string;
  createdAt: any;
};

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    const fetchDisputes = async () => {
      const q = query(collection(db, 'disputes'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Dispute[];
      setDisputes(data);
      setLoading(false);
    };

    fetchDisputes();
  }, []);

  const handleUpdateDispute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;

    const disputeRef = doc(db, 'disputes', selectedDispute.id);
    await updateDoc(disputeRef, {
      status,
      adminNotes,
    });

    setDisputes(disputes.map(d => (d.id === selectedDispute.id ? { ...d, status, adminNotes } : d)));
    setSelectedDispute(null);
    setStatus('');
    setAdminNotes('');
  };

  if (loading) return <p>Loading disputes...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dispute Resolution Center</h1>
      {disputes.length === 0 ? (
        <p>No disputes to review.</p>
      ) : (
        <ul className="space-y-4">
          {disputes.map(d => (
            <li key={d.id} className="border p-4 rounded shadow-sm bg-white">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Renter ID: {d.renterUid}</p>
                  <p className="font-medium">Status: {d.status}</p>
                  <p className="text-sm text-gray-500">
                    Incident:{' '}
                    <Link
                      href={`/renter/incidents/${d.incidentId}`}
                      className="underline text-blue-600"
                    >
                      View Incident
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Description:</p>
                  <p>{d.description}</p>
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

              <div className="mt-4">
                {selectedDispute?.id === d.id ? (
                  <form onSubmit={handleUpdateDispute}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="status"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option>PENDING</option>
                          <option>REVIEWED</option>
                          <option>RESOLVED</option>
                          <option>REJECTED</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700">Admin Notes</label>
                        <textarea
                          id="adminNotes"
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button type="button" onClick={() => setSelectedDispute(null)} className="mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                      </button>
                      <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Update Dispute
                      </button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => {
                    setSelectedDispute(d);
                    setStatus(d.status);
                    setAdminNotes(d.adminNotes || '');
                  }} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Update
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
