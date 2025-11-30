import { ShieldCheck } from "lucide-react";

export function VerifiedBadge({ status }: { status: string }) {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
          ✓ Verified Identity (RentFAX)
        </span>
      );
    case "COMPANY_VERIFIED":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
          <ShieldCheck size={14} /> Company Verified
        </span>
      );
    default:
      return null;
  }
}
