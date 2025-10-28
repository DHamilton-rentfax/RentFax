'use client';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { useAuth } from '@/hooks/use-auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function RenterDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const q = query(
        collection(db, "renterReports"),
        where("email", "==", user.email)
      );
      const snap = await getDocs(q);
      setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    })();
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Reports</h1>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li key={r.id} className="p-3 bg-white rounded shadow">
              <p><b>Type:</b> {r.type}</p>
              <p><b>Date:</b> {new Date(r.verifiedAt.seconds * 1000).toLocaleDateString()}</p>
              <p><b>Status:</b> {r.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
