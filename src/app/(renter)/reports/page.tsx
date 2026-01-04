'use client';

import Link from 'next/link';

export default function RenterReportsPage() {
  // TEMP: replace with Firestore query scoped to renterId
  const reports = [
    {
      id: 'report_123',
      companyName: 'Acme Rentals',
      status: 'FINAL',
      createdAt: '2024-12-01',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Rental Reports</h1>

      {reports.length === 0 && (
        <p className="text-gray-600 text-sm">
          No reports have been created yet.
        </p>
      )}

      <div className="space-y-3">
        {reports.map((r) => (
          <Link
            key={r.id}
            href={`/reports/${r.id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{r.companyName}</p>
                <p className="text-xs text-gray-500">
                  Created: {r.createdAt}
                </p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100">
                {r.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
