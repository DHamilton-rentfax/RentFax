
'use client';

import { useState } from 'react';
import { updateDisputeStatus } from '@/app/actions/update-dispute-status';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth'; // Assuming you have a hook to get the current admin user

interface DisputeStatusUpdaterProps {
  disputeId: string;
}

export default function DisputeStatusUpdater({ disputeId }: DisputeStatusUpdaterProps) {
  const { user: adminUser } = useAuth(); // Assumes the admin is a logged-in user
  const [adminNotes, setAdminNotes] = useState('');
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (newStatus: 'approved' | 'rejected') => {
    if (!adminNotes) {
      setError('Admin notes are required to approve or reject a dispute.');
      return;
    }
    if (!adminUser) {
      setError('You must be logged in to perform this action.');
      return;
    }

    setLoading(newStatus);
    setError(null);

    const result = await updateDisputeStatus({
      disputeId,
      newStatus,
      adminNotes,
      adminUserId: adminUser.uid, // Pass the admin's user ID
    });

    if (result.success) {
      alert(`Dispute successfully ${newStatus}. The renter has been notified.`);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setLoading(null);
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold mb-2">Take Action</h3>
      <Textarea
        placeholder="Provide notes for the renter (required)..."
        value={adminNotes}
        onChange={(e) => setAdminNotes(e.target.value)}
        className="mb-4"
      />
      <div className="flex space-x-4">
        <Button 
          onClick={() => handleUpdate('approved')}
          disabled={!!loading}
          variant="default"
          className="bg-green-600 hover:bg-green-700"
        >
          {loading === 'approve' ? 'Approving...' : 'Approve Dispute'}
        </Button>
        <Button 
          onClick={() => handleUpdate('rejected')}
          disabled={!!loading}
          variant="destructive"
        >
          {loading === 'reject' ? 'Rejecting...' : 'Reject Dispute'}
        </Button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
