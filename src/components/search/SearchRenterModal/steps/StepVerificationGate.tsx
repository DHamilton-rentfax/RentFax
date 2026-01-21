"use client";

import {
  ShieldCheck,
  Send,
  FileSignature,
  Loader2,
  Eye,
} from "lucide-react";

import type { SearchResult } from "@/components/search/types";

type Props = {
  result: SearchResult | null;

  renterInput: {
    fullName: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    licenseNumber?: string | null;
  };

  isLegacyEligible: boolean;

  onInstantVerify: () => Promise<void>;
  onSelfVerify: () => Promise<void>;
  onLegacyVerify: () => Promise<void>;
  onViewSample: () => void;

  onBack: () => void;

  loadingInstant?: boolean;
  loadingSelfVerify?: boolean;
};

export default function StepVerificationGate({
  result,
  renterInput,
  isLegacyEligible,
  onInstantVerify,
  onSelfVerify,
  onLegacyVerify,
  onViewSample,
  onBack,
  loadingInstant,
  loadingSelfVerify,
}: Props) {
  const profile = result?.publicProfile ?? {};

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-xs text-gray-600">
        ← Back to search
      </button>

      <h3 className="text-lg font-semibold">
        {result?.hasReport ? "Renter record found" : "Verification required"}
      </h3>

      <div className="text-sm space-y-1">
        <p>Name: {profile.name || renterInput.fullName}</p>
        <p>Email: {profile.email || renterInput.email}</p>
        <p>Phone: {profile.phone || renterInput.phone}</p>
        <p>Address: {profile.address || renterInput.address}</p>
      </div>

      <div className="space-y-3">
        <button onClick={onInstantVerify} disabled={loadingInstant}>
          {loadingInstant ? <Loader2 className="animate-spin inline mr-2" /> : <ShieldCheck className="inline mr-2" />}
          Instant verification ($4.99)
        </button>

        <button onClick={onSelfVerify} disabled={loadingSelfVerify}>
          {loadingSelfVerify ? <Loader2 className="animate-spin inline mr-2" /> : <Send className="inline mr-2" />}
          Send self-verification link
        </button>

        {isLegacyEligible && (
          <button onClick={onLegacyVerify}>
            <FileSignature className="inline mr-2" />
            Legacy partner unlock
          </button>
        )}

        <button onClick={onViewSample}>
          <Eye className="inline mr-2" />
          View sample report
        </button>
      </div>
    </div>
  );
}
