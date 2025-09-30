'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getDisputeById } from '@/app/actions/get-dispute-by-id';
import { updateDisputeStatus } from '@/app/actions/update-dispute-status';
import { IncidentCard } from '@/components/IncidentCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dispute } from '@/types/dispute';

export default function AdminDisputePage() {
  const { id } = useParams();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (id) {
      getDisputeById(id as string).then((data) => {
        if (data) {
            setDispute(data);
            setStatus(data?.status || '');
            setNote(data?.adminNote || '');
        }
      });
    }
  }, [id]);

  const handleUpdate = async () => {
    if (!dispute) return;
    await updateDisputeStatus(dispute.id, status, note, 'admin'); // Assuming 'admin' as actorId for now
    alert('Dispute updated.');
  };

  if (!dispute) return <div className="p-6">Loading dispute...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dispute by {dispute.renter.name}</h1>

      <Badge variant="outline">Current Status: {dispute.status}</Badge>

      <p className="text-gray-600 mt-2">Dispute Explanation:</p>
      <div className="bg-gray-100 p-4 rounded">{dispute.explanation}</div>

      <div className="mt-4">
        <p className="text-gray-600 font-medium">Linked Incident</p>
        <IncidentCard incident={dispute.incident} />
      </div>

      {dispute.evidence?.length > 0 && (
        <div>
          <p className="font-medium mt-4">Evidence Submitted:</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            {dispute.evidence.map((url, i) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View Evidence {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <label className="block font-medium">Admin Notes</label>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
        <div className="flex flex-col gap-2 mt-2">
          <label>Status</label>
          <select
            className="p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        <Button className="mt-4" onClick={handleUpdate}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
