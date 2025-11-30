"use client";

import { VerificationBadge } from "@/components/verification/VerificationBadge";
import { IdentityAlerts } from "@/components/reports/IdentityAlerts";
import { IdentityScoreBreakdown } from "@/components/reports/IdentityScoreBreakdown";

export function ReportIdentitySection({
  renter,
  fraudSignals,
  matchScore,
}: {
  renter: any; // Replace with your Renter type if available
  fraudSignals: any;
  matchScore: number;
}) {
  const verificationStatus = renter.verificationStatus ?? "UNVERIFIED";

  // Future: auto-calc confidenceScore
  const confidenceScore = Math.max(
    0,
    Math.min(100, matchScore - renter.fraudScore + (verificationStatus === "FULL" ? 20 : 0))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h3 className="font-semibold text-slate-800 text-lg">Identity Verification</h3>
        <VerificationBadge status={verificationStatus} />
      </div>

      <IdentityAlerts
        verificationStatus={verificationStatus}
        fraudSignals={fraudSignals}
      />

      <IdentityScoreBreakdown
        confidenceScore={confidenceScore}
        matchScore={matchScore}
        fraudScore={renter.fraudScore ?? 0}
      />
    </div>
  );
}
