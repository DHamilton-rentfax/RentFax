"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type VerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "BASIC"
  | "FULL";

export function VerificationBadge({ status }: { status?: VerificationStatus }) {
  if (!status || status === "UNVERIFIED") {
    return (
      <Badge
        variant="outline"
        className="border-amber-500 text-amber-700 bg-amber-50"
      >
        Unverified: identity pending
      </Badge>
    );
  }

  if (status === "PENDING") {
    return (
      <Badge
        variant="outline"
        className="border-blue-500 text-blue-700 bg-blue-50"
      >
        Pending Review
      </Badge>
    );
  }

  if (status === "BASIC") {
    return (
      <Badge
        variant="outline"
        className="border-purple-600 text-purple-700 bg-purple-50"
      >
        Basic Verification
      </Badge>
    );
  }

  if (status === "FULL") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-600 text-emerald-700 bg-emerald-50"
      >
        Fully Verified
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-gray-400 text-gray-700">
      Unknown
    </Badge>
  );
}
