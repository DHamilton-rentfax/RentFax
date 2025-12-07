'use client';

import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function VerificationBadge({
  status,
}: {
  status?: 'verified' | 'pending' | 'rejected' | null;
}) {
  if (!status) return null;

  if (status === 'verified')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-[11px] font-semibold">
        <ShieldCheck className="h-3 w-3" />
        Verified
      </span>
    );

  if (status === 'pending')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[11px] font-semibold">
        <ShieldAlert className="h-3 w-3" />
        Verification Pending
      </span>
    );

  if (status === 'rejected')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-[11px] font-semibold">
        <ShieldAlert className="h-3 w-3" />
        Not Verified
      </span>
    );

  return null;
}
