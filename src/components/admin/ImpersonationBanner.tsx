'use client';

import { useEffect } from 'react';

type Props = {
  orgName: string;
  expiresAt?: string;
  redirectTo?: string;
};

export default function ImpersonationBanner({
  orgName,
  expiresAt,
  redirectTo = '/admin',
}: Props) {
  async function exit() {
    try {
      const res = await fetch('/api/admin/impersonate/exit', {
        method: 'POST',
      });

      if (res.ok) {
        window.location.href = redirectTo;
      } else {
        console.error('Failed to exit impersonation');
      }
    } catch (err) {
      console.error('Exit impersonation error', err);
    }
  }

  useEffect(() => {
    if (!expiresAt) return;

    const expiryMs = new Date(expiresAt).getTime();
    if (Number.isNaN(expiryMs)) return;

    const timeout = setTimeout(exit, Math.max(0, expiryMs - Date.now()));
    return () => clearTimeout(timeout);
  }, [expiresAt]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 flex justify-between items-center shadow-lg">
      <div className="text-sm">
        ⚠️ <strong>Impersonation Active</strong> — Acting as{' '}
        <strong>{orgName}</strong>
        <div className="text-xs opacity-90">
          All actions are logged for security and audit purposes.
        </div>
      </div>

      <button
        onClick={exit}
        className="bg-white text-red-700 font-semibold px-3 py-1 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white"
      >
        Exit Impersonation
      </button>
    </div>
  );
}
