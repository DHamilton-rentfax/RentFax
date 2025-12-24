'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId');
  const [status, setStatus] = useState('');

  const acceptInvite = async () => {
    // This is a placeholder for the actual invite ID
    // In a real application, this would come from a user-specific link
    const inviteId = prompt('Enter your invite ID');
    if (!inviteId) return;

    // This is a placeholder for the current user's ID
    const userId = prompt('Enter your user ID');
    if (!userId) return;

    const res = await fetch('/api/company/team/accept', {
      method: 'POST',
      body: JSON.stringify({ inviteId, userId }),
    });

    if (res.ok) {
      setStatus('Invite accepted successfully!');
    } else {
      const data = await res.json();
      setStatus(`Error: ${data.error}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Accept Invitation</h1>
      <p>You have been invited to join a team on RentFAX.</p>
      {companyId && <p>Company ID: {companyId}</p>}

      <button
        className="bg-blue-600 text-white px-5 py-3 rounded"
        onClick={acceptInvite}
      >
        Accept Invite
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}
