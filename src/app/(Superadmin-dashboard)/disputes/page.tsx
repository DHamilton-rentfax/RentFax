'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import DisputeTable from './components/DisputeTable';
import { useCodeSageAudits } from '@/hooks/useCodeSageAudits';

export default function AdminDisputesAndAuditsPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loadingDisputes, setLoadingDisputes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CodeSage AI Audits
  const { id } = useParams();
  const { audits, loading: loadingAudits } = useCodeSageAudits(id as string);

  useEffect(() => {
    const loadDisputes = async () => {
      try {
        const res = await fetch('/api/disputes');
        if (!res.ok) throw new Error(`Failed to fetch disputes: ${res.status}`);
        const data = await res.json();
        setDisputes(data.disputes || []);
      } catch (err: any) {
        console.error('Error loading disputes:', err);
        setError('Failed to load disputes.');
      } finally {
        setLoadingDisputes(false);
      }
    };
    loadDisputes();
  }, []);

  return (
    <main className="max-w-6xl mx-auto py-10 px-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">
        Renter Disputes & AI Audits
      </h1>

      {/* ----------- Disputes Section ----------- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Renter Disputes</h2>
        {loadingDisputes ? (
          <div className="flex items-center text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading disputes...
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : disputes.length > 0 ? (
          <DisputeTable data={disputes} />
        ) : (
          <p className="text-gray-500">No disputes found.</p>
        )}
      </section>

      {/* ----------- AI Audit Section ----------- */}
      <section>
        <h2 className="text-xl font-semibold mb-4">CodeSage AI Audits</h2>

        {loadingAudits && (
          <div className="flex items-center text-gray-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading audits...
          </div>
        )}

        {!loadingAudits && audits?.length === 0 && (
          <p className="text-gray-500">No AI audits found for this renter.</p>
        )}

        {audits?.map((audit) => (
          <div
            key={audit.id}
            className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">
                {audit.fileName || 'Unnamed File'}
              </h3>
              <span className="text-gray-400 text-sm">
                {audit.createdAt?.seconds
                  ? new Date(audit.createdAt.seconds * 1000).toLocaleString()
                  : 'N/A'}
              </span>
            </div>

            {audit.aiIssues?.length ? (
              <ul className="text-sm text-gray-700 list-disc pl-4 space-y-1">
                {audit.aiIssues.map((issue: any, idx: number) => (
                  <li key={idx}>
                    <strong>[{issue.severity}]</strong> {issue.message}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No issues found.</p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
