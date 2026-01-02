'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FileText } from 'lucide-react';

import { db } from '@/firebase/client';

export default function AssetReportList({ assetId }: any) {
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      const q = query(collection(db, 'reports'), where('assetId', '==', assetId));
      const snap = await getDocs(q);
      setReports(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchReports();
  }, [assetId]);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="font-semibold mb-3 flex items-center gap-2">
        <FileText size={18} /> Reports Linked to This Asset
      </h2>
      {reports.length === 0 ? (
        <p className="text-gray-600 text-sm">No reports have been created for this asset yet.</p>
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id} className="border rounded-xl p-3">
              <p className="text-sm font-medium">{r.type}</p>
              <p className="text-xs text-gray-600">{r.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
