"use client";

import {
  ShieldCheck,
  Send,
  FileSignature,
  Eye,
} from "lucide-react";

import type { SearchResult } from "@/components/search/types"; // ✅ CORRECTED IMPORT PATH

/* ------------------------------------------------------
 * PROPS
 * ---------------------------------------------------- */

type Props = {
  result: SearchResult;
  renterInput: {
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    licenseNumber?: string;
  };
  onProceedIdentityCheck: () => void;
  onSendSelfVerification: () => void;
};

/* ------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------- */

export default function MatchFoundScreen({
  result,
  renterInput,
  onProceedIdentityCheck,
  onSendSelfVerification,
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
      {/* HEADER */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {hasReport ? "Renter record found" : "No RentFAX history found"}
        </h3>
        <p className="text-sm text-gray-600">
          {hasReport
            ? "We recommend verifying identity before continuing."
            : "This renter is not in the database. Verification is required."}
        </p>
      </div>

      {/* DETAILS */}
      <div className="border-t border-dashed pt-4 text-sm space-y-1">
        <p className="font-medium text-gray-800">Renter details</p>
        <p>Name: {display.name || "—"}</p>
        <p>Email: {display.email || "—"}</p>
        <p>Phone: {display.phone || "—"}</p>
        {display.address && <p>Address: {display.address}</p>}
        {display.license && <p>License: {display.license}</p>}
      </div>

      {/* ACTIONS */}
      <div className="space-y-3">
        <button
          onClick={onProceedIdentityCheck}
          className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white"
        >
          <ShieldCheck className="inline h-3 w-3 mr-2" />
          Instant verification ($4.99)
        </button>

        <button
          onClick={onSendSelfVerification}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
        >
          <Send className="inline h-3 w-3 mr-2" />
          Send self-verification link
        </button>

        <button
          disabled
          className="w-full rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-400"
        >
          <Eye className="inline h-3 w-3 mr-2" />
          Sample report (preview)
        </button>
      </div>
    </div>
  );
}
