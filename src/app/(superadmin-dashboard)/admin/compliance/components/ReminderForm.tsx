'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function ReminderForm({ users }: { users: any[] }) {
  const [sending, setSending] = useState(false);

  const handleSendReminders = async () => {
    if (!users.length) return toast.error('No non-compliant users to notify.');

    setSending(true);
    try {
      const res = await fetch('/api/admin/compliance/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ users }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success('Reminder emails sent successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send reminders.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border mb-8">
      <h2 className="text-xl font-semibold text-[#1A2540] mb-2">Send Reminder Emails</h2>
      <p className="text-gray-700 mb-4">
        There are currently <strong>{users.length}</strong> non-compliant users.
      </p>
      <button
        onClick={handleSendReminders}
        disabled={sending}
        className="bg-[#1A2540] text-white font-semibold px-4 py-2 rounded-md hover:bg-[#2d3c66]"
      >
        {sending ? 'Sending...' : 'Send Reminders'}
      </button>
    </div>
  );
}
