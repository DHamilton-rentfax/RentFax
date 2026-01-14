'use client';

/* -------------------------------------------------------------------------------------------------
 * IMPORTS
 * ------------------------------------------------------------------------------------------------*/
import ModalAuthGate from "@/components/auth/ModalAuthGate.client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { AppUser } from "@/types/user";

import StepSearchForm from "./steps/StepSearchForm";
import StepMultiMatch from "./steps/StepMultiMatch";
import StepVerificationGate from "./steps/StepVerificationGate";

import { useSearchState } from "@/components/search/useSearchState";

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
  licenseNumber?: string | null;
};

export type SearchResult = {
  matchType?: "none" | "single" | "multi";
  unlocked?: boolean;
  preMatchedReportId?: string | null;
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
  const { uiState, dispatch, initialSearchState } = useSearchState();

  /* ---------------------------------- FORM STATE ---------------------------------- */
  const [fullName, setFullName] = useState(initialSearchState.fullName);
  const [email, setEmail] = useState(initialSearchState.email);
  const [phone, setPhone] = useState(initialSearchState.phone);
  const [address, setAddress] = useState(initialSearchState.address);
  const [city, setCity] = useState(initialSearchState.city);
  const [postalCode, setPostalCode] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  /* ---------------------------------- UX STATE ---------------------------------- */
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [instantLoading, setInstantLoading] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);

  /* ---------------------------------- AUTH ---------------------------------- */
  const [showAuthGate, setShowAuthGate] = useState(false);

  /* ---------------------------------- LIFECYCLE ---------------------------------- */
  useEffect(() => {
    if (open) {
      dispatch({ type: "OPEN" });
    } else {
      setResult(null);
      setError(null);
      setProgress(0);
      dispatch({ type: "CLOSE" });
    }
  }, [open, dispatch]);

  /* ---------------------------------- SEARCH ---------------------------------- */
  async function handleSubmit() {
    dispatch({ type: "SUBMIT_SEARCH" });
    setError(null);
    setResult(null);

    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(p + 8, 92);
      setProgress(p);
    }, 150);

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

      const data = await onSearch?.(payload);
      setResult(data || null);

      dispatch({
        type: "SEARCH_SUCCESS",
        matchType: data?.matchType || "none",
      });
    } catch (err: any) {
      setError(err?.message || "Search failed");
      dispatch({ type: "SEARCH_ERROR" });
    } finally {
      clearInterval(timer);
      setTimeout(() => setProgress(0), 300);
    }
  }

  /* ---------------------------------- PDPL ($4.99) ---------------------------------- */
  async function handleInstantVerify() {
    if (!user) {
      setShowAuthGate(true);
      return;
    }

    setInstantLoading(true);
    try {
      const res = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PDPL",
          renterInput: { fullName, email, phone, address, licenseNumber },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Stripe redirect OR internal bypass handled server-side
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInstantLoading(false);
    }
  }

  /* ---------------------------------- PAYG REPORT ($20) ---------------------------------- */
  async function handlePaygUnlock() {
    if (!result?.preMatchedReportId) return;

    if (!user) {
      setShowAuthGate(true);
      return;
    }

    setInstantLoading(true);
    try {
      const res = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "PAYG_REPORT",
          reportId: result.preMatchedReportId,
          renterInput: { fullName, email, phone },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unlock failed");

      if (data.bypassed) {
        setResult(r => r ? { ...r, unlocked: true } : r);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setInstantLoading(false);
    }
  }

  /* ---------------------------------- SELF VERIFY ---------------------------------- */
  async function handleSelfVerify() {
    if (!result?.preMatchedReportId) return;

    setSelfVerifyLoading(true);
    try {
      await fetch("/api/self-verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: result.preMatchedReportId,
          renter: { fullName, email, phone },
        }),
      });
      onClose();
    } finally {
      setSelfVerifyLoading(false);
    }
  }

  const handleBack = () => dispatch({ type: "BACK" });

  const isSearchDisabled =
    fullName.trim().length < 3 ||
    (!email?.trim() && !phone?.trim());

  /* -------------------------------------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------------------------------------*/
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[15000] bg-black/60 backdrop-blur-sm flex justify-end"
            onMouseDown={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              ref={panelRef}
              className="bg-white h-full w-full sm:max-w-lg shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="font-semibold">Search Renter</h2>
                <button onClick={onClose}><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {uiState === "SEARCH_INPUT" && (
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
                  />
                )}

                {(uiState === "MATCH_CONTEXT" ||
                  uiState === "VERIFICATION_DECISION") &&
                  result && (
                    <StepVerificationGate
                      result={result}
                      renterInput={{ fullName, email, phone, address, licenseNumber }}
                      isLegacyEligible={Boolean(user?.companyId)}
                      onInstantVerify={handleInstantVerify}
                      onUnlockPayg={handlePaygUnlock}
                      onSelfVerify={handleSelfVerify}
                      onBack={handleBack}
                      loadingInstant={instantLoading}
                      loadingSelfVerify={selfVerifyLoading}
                    />
                  )}
              </div>

              {uiState === "SEARCH_INPUT" && (
                <div className="border-t p-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSearchDisabled}
                    className="w-full bg-[#1A2540] text-white py-3 rounded-xl disabled:bg-gray-300"
                  >
                    Commence Search
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>

          {showAuthGate && (
            <ModalAuthGate
              mode="signup"
              title="Continue"
              subtitle="Create an account to keep an audit trail."
              onClose={() => setShowAuthGate(false)}
              onAuthed={() => {
                setShowAuthGate(false);
              }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
