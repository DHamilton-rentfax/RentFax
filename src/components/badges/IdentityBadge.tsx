"use client";

import { ShieldCheck, ShieldAlert } from "lucide-react";

export default function IdentityBadge({
  verified,
  method,
  className = "",
}: {
  verified: boolean;
  method?: string | null;
  className?: string;
}) {
  if (!verified) {
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-gray-200 text-gray-600 ${className}`}>
        <ShieldAlert className="h-3 w-3 mr-1" />
        Unverified
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-[11px] rounded-full bg-green-600 text-white ${className}`}>
      <ShieldCheck className="h-3 w-3 mr-1" />
      Verified
    </span>
  );
}
