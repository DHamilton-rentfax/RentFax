'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';
import { db } from '@/firebase/client';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

type Dispute = { id: string; subject: string; status: string; createdAt: number };

export default function RenterDisputesPage({ searchParams }: { searchParams: { token: string } }) {
  const { token } = searchParams;
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const { notify } = useToast();
  const [orgId, renterId] = Buffer.from(token, 'base64').toString().split(':');

  useEffect(() => {
    const q = query(collection(db, `orgs/${orgId}/disputes`), where("renterId", "==", renterId));
    const unsub = onSnapshot(q, snap => {
        const newDisputes = snap.docChanges().filter(c => c.type === "added");
        if (newDisputes.length > 0) notify("📢 New dispute created");
        setDisputes(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    });
    return () => unsub();
  }, [orgId, renterId, notify]);

  async function fileDispute() {
    await fetch('/api/renter/disputes', {
      method: 'POST',
      body: JSON.stringify({ token, subject, details }),
    });
    setSubject('');
    setDetails('');
    notify('Dispute filed successfully');
  }

  async function uploadEvidence(id: string, file: File) {
    const res = await fetch('/api/renter/disputes/evidence', {
      method: 'POST',
      body: JSON.stringify({ token, id, fileName: file.name }),
    });
    const { uploadUrl } = await res.json();
    await fetch(uploadUrl, { method: 'PUT', body: file });
    notify('Evidence uploaded');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Disputes</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">File a New Dispute</h2>
        <input
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder="Subject"
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Details"
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={fileDispute} className="bg-red-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>

      <div className="space-y-4">
        {disputes.map(d => (
          <div key={d.id} className="border p-3 rounded bg-white">
            <div className="flex justify-between items-center">
                <div>
                    <p><b>{d.subject}</b> — {d.status}</p>
                    <p className="text-sm text-gray-500">Filed {new Date(d.createdAt).toLocaleDateString()}</p>
                </div>
                <Link href={`/renter/disputes/${d.id}`} className="text-blue-600 hover:underline">
                    View
                </Link>
            </div>
            <input
              type="file"
              onChange={e => e.target.files && uploadEvidence(d.id, e.target.files[0])}
              className="mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
