"use client";

import { ArrowLeft, Loader2, Send, ShieldCheck } from "lucide-react";
import type { SearchResult } from "../SearchRenterModal";

type Props = {
  result: SearchResult | null;
  setActiveStep: (s: 1 | 2 | 3 | "multi" | "noMatch") => void;
  setViewMode: (v: "search" | "sample") => void;
  handleIdentityCheckout: () => Promise<void>;
  identityLoading: boolean;

  setVerifyName: (v: string) => void;
  setVerifyEmail: (v: string) => void;
  setVerifyPhone: (v: string) => void;
  setOpenSelfVerify: (v: boolean) => void;

  fullName: string;
  email: string;
  phone: string;
  address: string;
  licenseNumber: string;

  onClose: () => void;
};

export default function StepMatchFound({
  result,
  setActiveStep,
  setViewMode,
  handleIdentityCheckout,
  identityLoading,
  setVerifyName,
  setVerifyEmail,
  setVerifyPhone,
  setOpenSelfVerify,
  fullName,
  email,
  phone,
  address,
  licenseNumber,
  onClose,
}: Props) {
  if (!result) return null;

  const profile = (result.publicProfile ?? {}) as Partial<{
    name: string;
    email: string;
    phone: string;
    address: string;
    licenseNumber: string;
  }>;

  // If a pre-matched report exists, we can allow continuing to Step 3
  const hasReport = Boolean(result.preMatchedReportId);

  // Prefer matched profile fields, fall back to what the user entered
  const displayName = profile.name?.trim() || fullName?.trim() || "";
  const displayEmail = profile.email?.trim() || email?.trim() || "";
  const displayPhone = profile.phone?.trim() || phone?.trim() || "";
  const displayAddress = profile.address?.trim() || address?.trim() || "";
  const displayLicense =
    profile.licenseNumber?.trim() || licenseNumber?.trim() || "";

  function startSelfVerify() {
    // Pre-fill modal with best-available info
    setVerifyName(displayName);
    setVerifyEmail(displayEmail);
    setVerifyPhone(displayPhone);
    setOpenSelfVerify(true);
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => setActiveStep(1)}
        className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        type="button"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </button>

      {/* Headline */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          {hasReport ? "Internal renter record found" : "No RentFAX history found"}
        </h3>

        <p className="text-sm text-gray-600">
          {hasReport
            ? "This renter has a RentFAX profile. Identity verification is recommended before proceeding."
            : "This renter does not yet have a RentFAX history. You can still verify their identity safely."}
        </p>
      </div>

      {/* Entered / matched details */}
      <div className="text-sm text-gray-700 space-y-1 border-t border-dashed pt-4">
        <p className="font-medium text-gray-800">Renter details</p>
        <p>Name: {displayName || "—"}</p>
        <p>Email: {displayEmail || "—"}</p>
        <p>Phone: {displayPhone || "—"}</p>
        <p>Address: {displayAddress || "—"}</p>
        {displayLicense ? <p>License: {displayLicense}</p> : null}
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <ShieldCheck className="h-4 w-4" />
          Why verify identity?
        </div>

        <p className="text-xs text-gray-600 leading-relaxed">
          Identity verification protects you from fraudulent renters, establishes an audit trail, and
          helps ensure accurate reporting if an incident or dispute is later created.
        </p>
      </div>

      {/* Primary actions */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleIdentityCheckout}
          disabled={identityLoading}
          className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white disabled:opacity-50"
          type="button"
        >
          {identityLoading ? (
            <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
          ) : null}
          Identity check ($4.99)
        </button>

        <button
          onClick={startSelfVerify}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
          type="button"
        >
          <Send className="inline h-3 w-3 mr-2" />
          Send self-verification link
        </button>

        <button
          onClick={() => setViewMode("sample")}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
          type="button"
        >
          View sample report
        </button>
      </div>

      {/* Continue if report exists */}
      {hasReport ? (
        <button
          onClick={() => setActiveStep(3)}
          className="w-full rounded-full bg-gray-900 text-white px-3 py-2 text-xs font-semibold hover:bg-black"
          type="button"
        >
          Continue
        </button>
      ) : null}

      <button
        onClick={onClose}
        className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
        type="button"
      >
        Close
      </button>
    </div>
  );
}

