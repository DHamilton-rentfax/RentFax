'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function MaintenanceForm() {
  const [unitId, setUnitId] = useState('');
  const [issue, setIssue] = useState('');
  const [details, setDetails] = useState('');

  async function submit() {
    await fetch('/api/housing/maintenance/new', {
      method: 'POST',
      body: JSON.stringify({ unitId, issue, details }),
    });
    alert('Maintenance issue logged');
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Unit ID</label>
        <input
          className="w-full border p-3 rounded mt-2"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Issue Type</label>
        <input
          className="w-full border p-3 rounded mt-2"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Details</label>
        <textarea
          className="w-full border p-3 rounded mt-2 h-32"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>
      <Button className="w-full" onClick={submit}>
        Log Issue
      </Button>
    </div>
  );
}
