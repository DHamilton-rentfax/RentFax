'use client';

import { ShieldCheck } from "lucide-react";

export function PublicVerificationBadge() {
  return (
    <div className="inline-flex items-center rounded-full bg-green-600 text-white px-3 py-1 text-xs font-semibold shadow-sm">
      <ShieldCheck className="h-3 w-3 mr-1" />
      Verified Renter
    </div>
  );
}
