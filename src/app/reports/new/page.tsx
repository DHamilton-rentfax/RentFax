'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadDocuments from '@/components/reports/UploadDocuments';

export default function NewReportPage() {
  const router = useRouter();
  const [category, setCategory] = useState('vehicle');
  const [renterName, setRenterName] = useState('');
  const [renterEmail, setRenterEmail] = useState('');

  async function createReport() {
    const res = await fetch('/api/reports/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        renter: { name: renterName, email: renterEmail },
      }),
    });
    const { reportId } = await res.json();
    router.push(`/reports/${reportId}/review`);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Report</h1>
      <div className="space-y-4">
        <div>
          <label className="block font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="vehicle">Vehicle</option>
            <option value="housing">Housing</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold">Renter Name</label>
          <input
            type="text"
            value={renterName}
            onChange={(e) => setRenterName(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block font-semibold">Renter Email</label>
          <input
            type="email"
            value={renterEmail}
            onChange={(e) => setRenterEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <button
          onClick={createReport}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Report
        </button>
      </div>
    </div>
  );
}
