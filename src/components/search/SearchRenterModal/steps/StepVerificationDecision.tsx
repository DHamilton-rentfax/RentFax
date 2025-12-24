"use client";

import { ShieldCheck, Send, FileSignature, Loader2 } from "lucide-react";
import { useState } from "react";

type VerificationPath = "instant" | "self" | "legacy";

type StepVerificationDecisionProps = {
  isLegacyEligible: boolean;
  onSelectPath: (path: VerificationPath) => Promise<void>;
  onBack: () => void;
};

export default function StepVerificationDecision({
  isLegacyEligible,
  onSelectPath,
  onBack,
}: StepVerificationDecisionProps) {
  const [loadingPath, setLoadingPath] = useState<VerificationPath | null>(null);

  const handleSelect = async (path: VerificationPath) => {
    if (loadingPath) return;
    setLoadingPath(path);
    try {
      await onSelectPath(path);
    } catch (e) {
      // The parent component is expected to handle and display any errors.
      console.error(`Failed to initiate verification path '${path}':`, e);
      setLoadingPath(null); // Reset loading state on failure to allow retry.
    }
    // On success, we don't reset the loading state, as the parent component
    // will navigate away from this step.
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div>
            <h2 className="text-xl font-semibold">Choose a Verification Method</h2>
            <p className="mt-1 text-sm text-gray-600">
              Verification is a one-time, renter-anchored process to ensure data accuracy and create a permanent, auditable record before a report is generated.
            </p>
        </div>

        <div className="space-y-4">
            {/* Option A: Instant Verification */}
            <button
                onClick={() => handleSelect("instant")}
                disabled={!!loadingPath}
                className="w-full text-left border rounded-lg p-4 hover:border-gray-400 disabled:opacity-60 transition-all group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <ShieldCheck className="h-5 w-5 mr-3 text-gray-500" />
                        <p className="font-semibold">Instant Verification</p>
                    </div>
                    {loadingPath === 'instant' ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : (
                        <p className="font-semibold text-sm bg-gray-900 text-white rounded-full px-3 py-1 group-hover:bg-black">
                            $4.99
                        </p>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-600 pl-8">
                    Verify renter identity in seconds using public records and secure data provider checks. Best for immediate, confident decisions.
                </p>
            </button>

            {/* Option B: Renter Self-Verification */}
            <button
                onClick={() => handleSelect("self")}
                disabled={!!loadingPath}
                className="w-full text-left border rounded-lg p-4 hover:border-gray-400 disabled:opacity-60 transition-all group"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Send className="h-5 w-5 mr-3 text-gray-500" />
                        <p className="font-semibold">Renter Self-Verification</p>
                    </div>
                    {loadingPath === 'self' ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : (
                        <p className="font-semibold text-sm bg-gray-100 text-gray-800 rounded-full px-3 py-1">
                            Free
                        </p>
                    )}
                </div>
                <p className="mt-2 text-xs text-gray-600 pl-8">
                    Send a secure link to the renter to upload their ID and a selfie. The report unlocks after the renter completes verification.
                </p>
            </button>

            {/* Option C: Legacy Verification */}
            {isLegacyEligible && (
                 <button
                    onClick={() => handleSelect("legacy")}
                    disabled={!!loadingPath}
                    className="w-full text-left border rounded-lg p-4 hover:border-gray-400 disabled:opacity-60 transition-all group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileSignature className="h-5 w-5 mr-3 text-gray-500" />
                            <p className="font-semibold">Attest from Existing Records</p>
                        </div>
                        {loadingPath === 'legacy' ? (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                        ) : (
                             <p className="font-semibold text-xs text-gray-500 px-3 py-1">
                                For Trusted Partners
                            </p>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-gray-600 pl-8">
                        Attest to this renter's identity based on your pre-existing business relationship (e.g., a signed lease). This creates a "Furnisher-Verified" record.
                    </p>
                </button>
            )}
        </div>
        <div className="border-t pt-4">
            <button
                onClick={onBack}
                disabled={!!loadingPath}
                className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100 disabled:opacity-50"
                type="button"
              >
                Back
            </button>
        </div>
    </div>
  );
}
