'use client';

/* -------------------------------------------------------------------------------------------------
 * IMPORTS
 * ------------------------------------------------------------------------------------------------*/
import ModalAuthGate from "@/components/auth/ModalAuthGate.client";
import { useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { AppUser } from "@/types/user";

import type { RiskScoreResult } from "@/lib/risk/computeRiskScore";
import type { ConfidenceScoreResult } from "@/lib/risk/computeConfidenceScore";
import type { Signal } from "@/lib/risk/detectSignals";

import StepSearchForm from "./steps/StepSearchForm";
import StepMultiMatch from "./steps/StepMultiMatch";
import StepVerificationGate from "./steps/StepVerificationGate";
import SampleReportMobile from "./overlays/SampleReportMobile";

import {
  searchReducer,
  initialSearchState,
} from "./useSearchState";

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------------------------------------*/
export type SearchPayload = {
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  state?: string | null;
  licenseNumber?: string | null;
};

export type SearchResult = {
  id?: string;
  matchType?: "none" | "single" | "multi";
  identityScore?: number;

  risk?: {
    riskScore: RiskScoreResult;
    confidenceScore: ConfidenceScoreResult;
    signals: Signal[];
  };

  unlocked?: boolean;
  fullReport?: any;

  publicProfile?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    licenseNumber?: string | null;
  };

  candidates?: Array<{
    id: string;
    similarity: number;
    renter: {
      fullName: string;
      email?: string | null;
      phone?: string | null;
      address?: string | null;
      licenseNumber?: string | null;
    };
  }>;

  preMatchedReportId?: string | null;
};

/* -------------------------------------------------------------------------------------------------
 * MAIN COMPONENT
 * ------------------------------------------------------------------------------------------------*/
export default function SearchRenterModal({
  open,
  onClose,
  onSearch,
  user,
}: {
  open: boolean;
  onClose: () => void;
  onSearch?: (payload: SearchPayload) => Promise<SearchResult>;
  user?: AppUser | null;
}) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(
    searchReducer,
    initialSearchState
  );

  /* ---------------------------------- FORM STATE ---------------------------------- */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  /* ---------------------------------- UX STATE ---------------------------------- */
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [identityLoading, setIdentityLoading] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);

  /* ---------------------------------- VIEW MODE ---------------------------------- */
  const [viewMode, setViewMode] = useState<"search" | "sample">("search");

  /* ---------------------------------- AUTH ---------------------------------- */
  const [showAuthGate, setShowAuthGate] = useState(false);

  /* ---------------------------------- RESET ON CLOSE ---------------------------------- */
  useEffect(() => {
    if (!open) {
      dispatch({ type: "RESET" });
      setResult(null);
      setError(null);
      setProgress(0);
      setViewMode("search");
    }
  }, [open]);

  /* ---------------------------------- SEARCH ---------------------------------- */
  async function handleSubmit() {
    dispatch({ type: "START_SEARCH" });
    setError(null);
    setResult(null);
    setProgress(0);

    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(p + 6 + Math.random() * 6, 92);
      setProgress(p);
    }, 160);

    try {
      const payload: SearchPayload = {
        fullName: fullName.trim(),
        email: email || null,
        phone: phone || null,
        address: address || null,
        city,
        postalCode,
        licenseNumber: licenseNumber || null,
      };

      const data = await (onSearch ?? defaultSearch)(payload);
      setResult(data);

      if (data.matchType === "multi") {
        dispatch({ type: "NEXT_STEP", payload: "search" });
      } else {
        dispatch({ type: "NEXT_STEP", payload: "verification" });
      }
    } catch (err: any) {
      setError(err?.message || "Search failed");
      dispatch({ type: "ERROR", payload: "Search failed" });
    } finally {
      clearInterval(timer);
      setTimeout(() => setProgress(0), 300);
    }
  }

  async function defaultSearch(_: SearchPayload): Promise<SearchResult> {
    return {} as SearchResult;
  }

  /* ---------------------------------- SELF VERIFY ---------------------------------- */
  async function handleSelfVerify() {
    if (!result?.preMatchedReportId) {
      alert("Missing report ID");
      return;
    }

    setSelfVerifyLoading(true);
    try {
      const res = await fetch("/api/self-verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: result.preMatchedReportId,
          renter: { fullName, email, phone },
        }),
      });

      if (!res.ok) throw new Error("Failed to send verification link");
      alert("Verification link sent");
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSelfVerifyLoading(false);
    }
  }

  /* -------------------------------------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------------------------------------*/
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[15000] bg-black/60 backdrop-blur-sm flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose();
            }}
          >
            <motion.div
              ref={panelRef}
              className="bg-white h-full w-full sm:max-w-lg shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="font-semibold">Search Renter</h2>
                <button onClick={onClose}>
                  <X />
                </button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {state.step === "idle" && (
                  <StepSearchForm
                    fullName={fullName}
                    email={email}
                    phone={phone}
                    address={address}
                    city={city}
                    postalCode={postalCode}
                    licenseNumber={licenseNumber}
                    setFullName={setFullName}
                    setEmail={setEmail}
                    setPhone={setPhone}
                    setAddress={setAddress}
                    setCity={setCity}
                    setPostalCode={setPostalCode}
                    setLicenseNumber={setLicenseNumber}
                    onSubmit={handleSubmit}
                  />
                )}

                {state.loading && <div>Searching…</div>}

                {state.step === "verification" && result && (
                  <StepVerificationGate
                    result={result}
                    renterInput={{
                      fullName,
                      email,
                      phone,
                      address,
                      licenseNumber,
                    }}
                    isLegacyEligible={Boolean(user?.companyId)}
                    onInstantVerify={() => setShowAuthGate(true)}
                    onSelfVerify={handleSelfVerify}
                    onLegacyVerify={async () => {}}
                    onBack={() =>
                      dispatch({ type: "NEXT_STEP", payload: "idle" })
                    }
                    onViewSample={() => setViewMode("sample")}
                    loadingInstant={identityLoading}
                    loadingSelfVerify={selfVerifyLoading}
                  />
                )}

                {error && <div className="text-red-600">{error}</div>}
              </div>
            </motion.div>
          </motion.div>

          {showAuthGate && (
            <ModalAuthGate
              mode="signup"
              title="Continue to Checkout"
              subtitle="Create an account to unlock the report and keep an audit trail."
              onClose={() => setShowAuthGate(false)}
              onAuthed={async () => {
                setShowAuthGate(false);
                // handleIdentityCheckout() wired elsewhere
              }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
