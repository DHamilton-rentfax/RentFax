'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminBillingUsage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/billing/usage?admin=1');
      const json = await res.json();

      setCompanies(json.companies || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Billing Usage (Admin)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {companies.map((c) => (
          <div
            key={c.id}
            className="p-5 border rounded-xl bg-white shadow-sm"
          >
            <p className="font-semibold text-lg">
              {c.name} ({c.plan})
            </p>

            <div className="grid grid-cols-2 gap-4 mt-3">
              {Object.keys(c.usage).map((event) => (
                <div key={event} className="text-sm">
                  <p className="text-gray-600">{event}</p>
                  <p className="font-bold">{c.usage[event]}</p>
                  <p className="text-xs text-gray-500">
                    Limit:{' '}
                    {c.limits[event] === Infinity
                      ? '∞'
                      : c.limits[event]}
                  </p>
                </div>
              ))}
            </div>

            {c.overLimit && (
              <div className="mt-3 rounded bg-red-50 border border-red-200 p-2 text-sm text-red-700">
                🚫 This company exceeded their limits.
              </div>
            )}

            <a
              href={`/admin/company/${c.id}`}
              className="inline-block mt-4 px-4 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-black"
            >
              View Company
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
