"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

export type IdentityAlertProps = {
  verificationStatus: "UNVERIFIED" | "PENDING" | "BASIC" | "FULL";
  fraudSignals?: {
    duplicateEmailCount: number;
    duplicatePhoneCount: number;
    duplicateAddressCount: number;
    sharedAddressFlaggedCount: number;
    highRiskRenterCount: number;
  };
};

export function IdentityAlerts({
  verificationStatus,
  fraudSignals,
}: IdentityAlertProps) {
  const alerts: React.ReactNode[] = [];

  // Verification warnings
  if (verificationStatus === "UNVERIFIED") {
    alerts.push(
      <div
        key="unverified"
        className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-300 p-2 rounded-md"
      >
        <AlertTriangle className="w-4 h-4" />
        This renter has not verified their identity.
      </div>
    );
  }

  if (verificationStatus === "PENDING") {
    alerts.push(
      <div
        key="pending"
        className="flex items-center gap-2 text-blue-700 bg-blue-50 border border-blue-300 p-2 rounded-md"
      >
        <AlertTriangle className="w-4 h-4" />
        Identity verification is pending review.
      </div>
    );
  }

  // No fraud signals yet?
  if (!fraudSignals) {
    return <div className="space-y-2">{alerts}</div>;
  }

  // Fraud indicators
  const {
    duplicateEmailCount,
    duplicatePhoneCount,
    duplicateAddressCount,
    sharedAddressFlaggedCount,
    highRiskRenterCount,
  } = fraudSignals;

  if (duplicateEmailCount > 0 || duplicatePhoneCount > 0) {
    alerts.push(
      <div
        key="dupes"
        className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-300 p-2 rounded-md"
      >
        <ShieldAlert className="w-4 h-4" />
        This identity shares email/phone with other renters. Possible fraud.
      </div>
    );
  }

  if (duplicateAddressCount > 1) {
    alerts.push(
      <div
        key="addressDupes"
        className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-300 p-2 rounded-md"
      >
        <ShieldAlert className="w-4 h-4" />
        Multiple renters use the same address. Review recommended.
      </div>
    );
  }

  if (sharedAddressFlaggedCount > 0) {
    alerts.push(
      <div
        key="sharedFlag"
        className="flex items-center gap-2 text-red-800 bg-red-100 border border-red-400 p-2 rounded-md"
      >
        <ShieldAlert className="w-4 h-4" />
        This address is shared with flagged/high-risk renters.
      </div>
    );
  }

  if (highRiskRenterCount > 0) {
    alerts.push(
      <div
        key="highRisk"
        className="flex items-center gap-2 text-red-800 bg-red-100 border border-red-400 p-2 rounded-md"
      >
        <ShieldAlert className="w-4 h-4" />
        Previous matches exhibit high-risk behavior.
      </div>
    );
  }

  if (alerts.length === 0) {
    alerts.push(
      <div
        key="clean"
        className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-300 p-2 rounded-md"
      >
        <ShieldCheck className="w-4 h-4" />
        No fraud signals detected.
      </div>
    );
  }

  return <div className="space-y-2">{alerts}</div>;
}
