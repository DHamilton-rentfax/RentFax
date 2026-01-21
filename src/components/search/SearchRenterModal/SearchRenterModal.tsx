"use client";

/* -------------------------------------------------------------------------------------------------
 * IMPORTS
 * ------------------------------------------------------------------------------------------------*/
import ModalAuthGate from "@/components/auth/ModalAuthGate.client";
import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import type { AppUser } from "@/types/user";

import StepSearchForm from "./steps/StepSearchForm";
import StepVerificationGate from "./steps/StepVerificationGate";

import { useSearchState, SearchOutcome } from "@/components/search/useSearchState";
import type { SearchResult } from "@/components/search/types";

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

interface Props {
  open: boolean;
  onClose: () => void;
  onSearch?: (payload: SearchPayload) => Promise<SearchResult>;
  user?: AppUser | null;
}

/* -------------------------------------------------------------------------------------------------
 * COMPONENT
 * ------------------------------------------------------------------------------------------------*/
export default function SearchRenterModal({
  open,
  onClose,
  onSearch,
  user,
}: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { uiState, dispatch, initialSearchState } = useSearchState();

  /* ---------------- FORM ---------------- */
  const [fullName, setFullName] = useState(initialSearchState.fullName);
  const [email, setEmail] = useState(initialSearchState.email);
  const [phone, setPhone] = useState(initialSearchState.phone);
  const [address, setAddress] = useState(initialSearchState.address);
  const [city, setCity] = useState(initialSearchState.city);
  const [postalCode, setPostalCode] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  /* ---------------- UX ---------------- */
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [instantLoading, setInstantLoading] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);
  const [showAuthGate, setShowAuthGate] = useState(false);

  /* ---------------- LIFECYCLE ---------------- */
  useEffect(() => {
    if (open) {
      dispatch({ type: "OPEN" });
    } else {
      setResult(null);
      setError(null);
      setFullName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setCity("");
      setPostalCode("");
      setLicenseNumber("");
      dispatch({ type: "CLOSE" });
    }
  }, [open, dispatch]);

  /* ---------------- INTERNAL SEARCH ---------------- */
  const internalSearch = useCallback(
    async (payload: SearchPayload): Promise<SearchResult> => {
      const res = await fetch("/api/renters/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.companyId ? { "x-org-id": user.companyId } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Search failed");

      return json as SearchResult;
    },
    [user?.companyId]
  );

  /* ---------------- SEARCH ---------------- */
  async function handleSubmit() {
    dispatch({ type: "SUBMIT_SEARCH" });
    setError(null);
    setResult(null);

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

      const fn = onSearch ?? internalSearch;
      const data = await fn(payload);

      setResult(data);

      let outcome: SearchOutcome;
      if (!data) outcome = "NOT_FOUND";
      else if (!data.verified && !data.hasReport)
        outcome = "FOUND_UNVERIFIED_NO_REPORT";
      else if (data.verified && data.hasReport)
        outcome = "FOUND_WITH_REPORT";
      else outcome = "FOUND_VERIFIED_NO_REPORT";

      dispatch({ type: "SEARCH_SUCCESS", outcome });
    } catch (err: any) {
      setError(err.message || "Search failed");
      dispatch({ type: "SEARCH_ERROR" });
    }
  }

  /* -------------------------------------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------------------------------------*/
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[15000] bg-black/60 flex justify-end">
            <motion.div
              ref={panelRef}
              className="bg-white h-full w-full sm:max-w-lg shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
            >
              <header className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="font-semibold">Search Renter</h2>
                <button onClick={onClose}>
                  <X />
                </button>
              </header>

              <main className="flex-1 overflow-y-auto p-4 space-y-6">

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

                {uiState === "SEARCHING" && (
                  <div className="flex flex-col items-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin mb-3" />
                    <p className="text-sm text-gray-600">
                      Searching RentFAX records…
                    </p>
                  </div>
                )}

                {(uiState === "VERIFICATION_DECISION" ||
                  uiState === "UNLOCK_REPORT" ||
                  uiState === "VERIFIED_NO_REPORT") && (
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
                    onInstantVerify={async () => setShowAuthGate(true)}
                    onSelfVerify={async () => {}}
                    onLegacyVerify={async () => {}}
                    onViewSample={() => {}}
                    onBack={() => dispatch({ type: "BACK" })}
                    loadingInstant={instantLoading}
                    loadingSelfVerify={selfVerifyLoading}
                  />
                )}

                {uiState === "ERROR" && (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-red-600">
                      We couldn’t complete the search
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">{error}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-[#1A2540] text-white rounded"
                      onClick={() => dispatch({ type: "BACK" })}
                    >
                      Go Back
                    </button>
                  </div>
                )}

                {/* FINAL DEFENSIVE FALLBACK */}
                {![
                  "SEARCH_INPUT",
                  "SEARCHING",
                  "VERIFICATION_DECISION",
                  "UNLOCK_REPORT",
                  "VERIFIED_NO_REPORT",
                  "ERROR",
                ].includes(uiState) && (
                  <div className="text-center text-sm text-gray-500 py-12">
                    Preparing next step…
                  </div>
                )}
              </main>

              {uiState === "SEARCH_INPUT" && (
                <footer className="border-t p-4">
                  <button
                    onClick={handleSubmit}
                    className="w-full py-3 bg-[#1A2540] text-white rounded-xl"
                  >
                    Commence Search
                  </button>
                </footer>
              )}
            </motion.div>
          </motion.div>

          {showAuthGate && (
            <ModalAuthGate
              mode="signup"
              title="Continue"
              subtitle="Create an account to keep an audit trail."
              onClose={() => setShowAuthGate(false)}
              onAuthed={() => setShowAuthGate(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
