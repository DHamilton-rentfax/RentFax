'use client';

import {
  ShieldCheck,
  Send,
  FileSignature,
  Loader2,
  Eye,
} from "lucide-react";

import type { SearchResult } from "../SearchRenterModal";

type Props = {
  result: SearchResult;
  renterInput: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    licenseNumber: string;
  };

  isLegacyEligible: boolean;

  onInstantVerify: () => Promise<void>;
  onSelfVerify: () => void;
  onLegacyVerify: () => Promise<void>;

  onBack: () => void;
  onViewSample: () => void;

  loadingInstant?: boolean;
  loadingSelfVerify?: boolean; // Added for visual feedback
};

export default function StepVerificationGate({
  result,
  renterInput,
  isLegacyEligible,
  onInstantVerify,
  onSelfVerify,
  onLegacyVerify,
  onBack,
  onViewSample,
  loadingInstant,
  loadingSelfVerify,
}: Props) {
  const profile = result.publicProfile ?? {};
  const hasReport = Boolean(result.preMatchedReportId);

  const display = {
    name: profile.name || renterInput.fullName,
    email: profile.email || renterInput.email,
    phone: profile.phone || renterInput.phone,
    address: profile.address || renterInput.address,
    license: profile.licenseNumber || renterInput.licenseNumber,
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="text-xs text-gray-600 hover:text-gray-900"
        type="button"
      >
        ← Back to search
      </button>

      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {hasReport
            ? "Renter record found"
            : "No RentFAX history yet"}
        </h3>
        <p className="text-sm text-gray-600">
          {hasReport
            ? "Identity verification is recommended before proceeding."
            : "You can create a verified renter record now."}
        </p>
      </div>

      <div className="border-t border-dashed pt-4 text-sm space-y-1">
        <p className="font-medium text-gray-800">Renter details</p>
        <p>Name: {display.name || "—"}</p>
        <p>Email: {display.email || "—"}</p>
        <p>Phone: {display.phone || "—"}</p>
        <p>Address: {display.address || "—"}</p>
        {display.license && <p>License: {display.license}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <ShieldCheck className="h-4 w-4" />
          Why verify?
        </div>
        <p className="text-xs text-gray-600">
          Verification protects against fraud, creates an audit trail, and ensures accurate reporting.
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onInstantVerify}
          disabled={loadingInstant || loadingSelfVerify}
          className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white disabled:opacity-50"
        >
          {loadingInstant ? (
            <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
          ) : (
            <ShieldCheck className="inline h-3 w-3 mr-2" />
          )}
          Instant verification ($4.99)
        </button>

        <button
          onClick={onSelfVerify}
          disabled={loadingInstant || loadingSelfVerify}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          {loadingSelfVerify ? (
            <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
          ) : (
            <Send className="inline h-3 w-3 mr-2" />
          )}
          Send self-verification link
        </button>

        {isLegacyEligible && (
          <button
            onClick={onLegacyVerify}
            disabled={loadingInstant || loadingSelfVerify}
            className="w-full rounded-full border border-purple-300 px-3 py-2 text-xs font-semibold hover:bg-purple-50 disabled:opacity-50"
          >
            <FileSignature className="inline h-3 w-3 mr-2" />
            Legacy partner unlock
          </button>
        )}

        <button
          onClick={onViewSample}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
        >
          <Eye className="inline h-3 w-3 mr-2" />
          View sample report
        </button>
      </div>
    </div>
  );
}
