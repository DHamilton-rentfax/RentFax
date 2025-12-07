"use client";

import { ShieldCheck, ShieldAlert, AlertTriangle, HelpCircle } from "lucide-react";

interface BadgeProps {
  status?:
    | "unverified"
    | "basic-submitted"
    | "verified"
    | "rejected"
    | "flagged"
    | null;

  fraudFlag?: boolean;
  small?: boolean;
}

const colors = {
  unverified: "text-gray-500 bg-gray-100 border-gray-300",
  "basic-submitted": "text-blue-600 bg-blue-100 border-blue-300",
  verified: "text-green-700 bg-green-100 border-green-300",
  rejected: "text-red-700 bg-red-100 border-red-300",
  flagged: "text-red-800 bg-red-200 border-red-400",
};

const labels = {
  unverified: "Unverified",
  "basic-submitted": "Pending Review",
  verified: "Verified",
  rejected: "Rejected",
  flagged: "Flagged",
};

export default function VerifiedIdentityBadge({
  status = "unverified",
  fraudFlag = false,
  small = false,
}: BadgeProps) {
  let icon = <HelpCircle className="h-4 w-4" />;

  if (fraudFlag || status === "flagged") {
    icon = <AlertTriangle className="h-4 w-4" />;
    status = "flagged";
  } else if (status === "verified") {
    icon = <ShieldCheck className="h-4 w-4" />;
  } else if (status === "basic-submitted") {
    icon = <ShieldAlert className="h-4 w-4" />;
  } else if (status === "rejected") {
    icon = <AlertTriangle className="h-4 w-4" />;
  }

  const sizeClass = small ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";

  return (
    <span
      className={`${colors[status]} inline-flex items-center gap-1 rounded-full border font-semibold ${sizeClass}`}>
      {icon}
      {labels[status]}
    </span>
  );
}
