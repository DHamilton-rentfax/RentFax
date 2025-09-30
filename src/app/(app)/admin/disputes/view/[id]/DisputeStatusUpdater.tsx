'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function DisputeStatusUpdater({ dispute }: { dispute: any }) {
  const [adminNote, setAdminNote] = useState(dispute.adminNote || '');
  const [status, setStatus] = useState(dispute.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/admin/disputes/${dispute.id}/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, adminNote }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update dispute');
      }
      setStatus(newStatus);
      alert('Dispute updated successfully!');
    } catch (error) {
      console.error(error);
      alert('There was an error updating the dispute.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-4 space-y-2">
      <label className="font-semibold">Admin Notes</label>
      <Textarea
        value={adminNote}
        onChange={(e) => setAdminNote(e.target.value)}
        className="w-full"
        rows={4}
        disabled={isSubmitting}
      />
      <div className="flex gap-2">
        <Button onClick={() => handleUpdate('UNDER_REVIEW')} variant="outline" disabled={isSubmitting}>
          Mark as Under Review
        </Button>
        <Button onClick={() => handleUpdate('RESOLVED')} disabled={isSubmitting}>
          Mark as Resolved
        </Button>
        <Button onClick={() => handleUpdate('REJECTED')} variant="destructive" disabled={isSubmitting}>
          Reject Dispute
        </Button>
      </div>
    </div>
  );
}
