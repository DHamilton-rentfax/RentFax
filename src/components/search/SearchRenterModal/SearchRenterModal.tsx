"use client";

/* -------------------------------------------------------------------------------------------------
 * IMPORTS
 * ------------------------------------------------------------------------------------------------*/
import ModalAuthGate from "@/components/auth/ModalAuthGate.client";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { AppUser } from "@/types/user";

import type { RiskScoreResult } from "@/lib/risk/computeRiskScore";
import type { ConfidenceScoreResult } from "@/lib/risk/computeConfidenceScore";
import type { Signal } from "@/lib/risk/detectSignals";

import StepSearchForm from "./steps/StepSearchForm";
import StepMultiMatch from "./steps/StepMultiMatch";
import StepNoMatch from "./steps/StepNoMatch";
import StepMatchFound from "./steps/StepMatchFound";
import StepRiskAndUnlock from "./steps/StepRiskAndUnlock";
import SampleReportMobile from "./overlays/SampleReportMobile";
import SelfVerifyModal from "./overlays/SelfVerifyModal";

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

type StepKey = 1 | 2 | 3 | "multi" | "noMatch";

/* -------------------------------------------------------------------------------------------------
 * CONSTANTS
 * ------------------------------------------------------------------------------------------------*/
const BRAND_GOLD = "#D9A334";
const PENDING_UNLOCK_KEY = "rentfax_pending_report_unlock_v1";
const DRAFT_KEY = "rentfax_search_draft_v1";

/* -------------------------------------------------------------------------------------------------
 * HELPERS
 * ------------------------------------------------------------------------------------------------*/
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const formatPhone = (val: string) => {
  const d = val.replace(/\D/g, "");
  if (!d) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
};

/* ---------------------------------- Pending Unlock ---------------------------------- */
function setPendingUnlock(reportId: string) {
  try {
    localStorage.setItem(
      PENDING_UNLOCK_KEY,
      JSON.stringify({ reportId, ts: Date.now() })
    );
  } catch {}
}

function getPendingUnlock(): { reportId: string; ts: number } | null {
  try {
    const raw = localStorage.getItem(PENDING_UNLOCK_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.reportId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearPendingUnlock() {
  try {
    localStorage.removeItem(PENDING_UNLOCK_KEY);
  } catch {}
}

/* ---------------------------------- Draft ---------------------------------- */
type Draft = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  addrQuery: string;
  city: string;
  postalCode: string;
  countryCode: "US" | "CA" | "GB" | "AU" | "MX" | "OTHER";
  stateCode: string;
  licenseNumber: string;
  useAutofill: boolean;
};

function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object") return null;
    return d as Draft;
  } catch {
    return null;
  }
}

function saveDraft(d: Draft) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(d));
  } catch {}
}

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
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement | null>(null);

  /* ---------------------------------- FORM STATE ---------------------------------- */
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [countryCode, setCountryCode] =
    useState<"US" | "CA" | "GB" | "AU" | "MX" | "OTHER">("US");
  const [stateCode, setStateCode] = useState("");

  /* ---------------------------------- MAPBOX ---------------------------------- */
  const [useAutofill, setUseAutofill] = useState(false);
  const [addrQuery, setAddrQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /* ---------------------------------- UX STATE ---------------------------------- */
  const [activeStep, setActiveStep] = useState<StepKey>(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [identityLoading, setIdentityLoading] = useState(false);
  const [fullReportCheckoutLoading, setFullReportCheckoutLoading] =
    useState(false);
  const [isReloading, setIsReloading] = useState(false);

  /* ---------------------------------- SELF VERIFY ---------------------------------- */
  const [openSelfVerify, setOpenSelfVerify] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);
  const [verifyName, setVerifyName] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");

  /* ---------------------------------- CONFIDENCE ---------------------------------- */
  const [confidence, setConfidence] = useState(0);

  /* ---------------------------------- VIEW MODE (SEARCH vs SAMPLE) --------------- */
  const [viewMode, setViewMode] = useState<"search" | "sample">("search");

  /* --------------------------------- PENDING ACTION + AUTH OVERLAY -----------------*/
  type PendingAction =
    | { type: "IDENTITY_CHECK" }
    | { type: "FULL_REPORT_UNLOCK"; reportId: string }
    | null;

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [viewerUid, setViewerUid] = useState<string | null>(user?.uid ?? null);
  const [viewerCompanyId, setViewerCompanyId] = useState<string | null>(
    user?.companyId ?? null
  );

  const companyId = viewerCompanyId ?? user?.companyId ?? null;

  async function refreshViewerContext(uid: string) {
    setViewerUid(uid);

    try {
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.exists() ? (snap.data() as any) : null;
      const cid = data?.companyId ?? null;
      setViewerCompanyId(cid);
    } catch {
      setViewerCompanyId(null);
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u?.uid) {
        refreshViewerContext(u.uid);
      } else {
        setViewerUid(null);
        setViewerCompanyId(null);
      }
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------- DRAFT RESTORE ---------------------------------- */
  useEffect(() => {
    if (!open) return;

    // Only restore draft if we're on Step 1 and no result
    if (activeStep !== 1 || result) return;

    const d = loadDraft();
    if (!d) return;

    setFullName(d.fullName || "");
    setEmail(d.email || "");
    setPhone(d.phone || "");
    setAddress(d.address || "");
    setAddrQuery(d.addrQuery || "");
    setCity(d.city || "");
    setPostalCode(d.postalCode || "");
    setCountryCode(d.countryCode || "US");
    setStateCode(d.stateCode || "");
    setLicenseNumber(d.licenseNumber || "");
    setUseAutofill(Boolean(d.useAutofill));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ---------------------------------- DRAFT SAVE (live) ---------------------------------- */
  useEffect(() => {
    if (!open) return;
    // Save draft whenever user edits
    const d: Draft = {
      fullName,
      email,
      phone,
      address,
      addrQuery,
      city,
      postalCode,
      countryCode,
      stateCode,
      licenseNumber,
      useAutofill,
    };
    saveDraft(d);
  }, [
    open,
    fullName,
    email,
    phone,
    address,
    addrQuery,
    city,
    postalCode,
    countryCode,
    stateCode,
    licenseNumber,
    useAutofill,
  ]);

  /* ---------------------------------- DERIVED CONFIDENCE ------------------------- */
  const formCompleteness = useMemo(() => {
    const fields = [
      fullName,
      email,
      phone,
      address || addrQuery,
      city,
      postalCode,
      countryCode,
      stateCode,
      licenseNumber,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [
    fullName,
    email,
    phone,
    address,
    addrQuery,
    city,
    postalCode,
    countryCode,
    stateCode,
    licenseNumber,
  ]);

  function deriveConfidence(data: SearchResult) {
    const backend =
      data.risk?.confidenceScore?.score ??
      (typeof data.identityScore === "number" ? data.identityScore : 0);

    // If backend is in a different scale (example you had), normalize it.
    const backendPct =
      backend > 300
        ? clamp(Math.round(((backend - 300) / 600) * 100), 0, 100)
        : clamp(backend, 0, 100);

    return Math.max(formCompleteness, backendPct);
  }

  function computeInputConfidence() {
    let score = 0;
    const has = (v: string) => v.trim().length > 0;

    if (has(fullName)) score += 25;
    if (has(email)) score += 15;
    if (has(phone)) score += 15;
    if (has(licenseNumber)) score += 20;

    const resolvedAddress = has(address) ? address : addrQuery;
    if (has(resolvedAddress)) score += 15;
    if (has(city)) score += 5;
    if (has(postalCode)) score += 5;

    return clamp(score, 0, 100);
  }

  const displayConfidence = useMemo(() => {
    if (result) return confidence;
    return computeInputConfidence();
  }, [
    result,
    confidence,
    fullName,
    email,
    phone,
    licenseNumber,
    address,
    addrQuery,
    city,
    postalCode,
  ]);

  const confidenceLabel = useMemo(() => {
    const c = displayConfidence;
    if (c >= 85) return "Very High";
    if (c >= 70) return "High";
    if (c >= 50) return "Medium";
    if (c >= 30) return "Low";
    return "Very Low";
  }, [displayConfidence]);

  /* ---------------------------------- AUTO SCROLL TOP ---------------------------------- */
  useEffect(() => {
    if (open && panelRef.current) {
      requestAnimationFrame(() => {
        panelRef.current?.scrollTo({ top: 0, behavior: "auto" });
      });
    }
  }, [open]);

  /* ---------------------------------- AUTO UNLOCK AFTER LOGIN ---------------------------------- */
  useEffect(() => {
    if (!open || !user?.uid) return;
    const pending = getPendingUnlock();
    if (!pending) return;

    if (Date.now() - pending.ts > 30 * 60 * 1000) {
      clearPendingUnlock();
      return;
    }

    (async () => {
      try {
        setIsReloading(true);
        await tryUnlockReport(pending.reportId);
      } finally {
        setIsReloading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user?.uid]);

  /* ---------------------------------- LOCK SCROLL ---------------------------------- */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* ---------------------------------- MAPBOX QUERY ---------------------------------- */
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
    if (!token || !useAutofill || addrQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      try {
        setSuggestionsLoading(true);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            addrQuery
          )}.json?autocomplete=true&limit=5&access_token=${token}`,
          { signal: ctrl.signal }
        );
        const json = await res.json();
        setSuggestions(json.features || []);
      } catch {
        // ignore
      } finally {
        setSuggestionsLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [addrQuery, useAutofill]);

  /* ---------------------------------- SEARCH ---------------------------------- */
  async function handleSubmit() {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setViewMode("search");

    let p = 0;
    const i = setInterval(() => {
      p = clamp(p + 5 + Math.random() * 8, 0, 92);
      setProgress(p);
    }, 180);

    try {
      const payload: SearchPayload = {
        fullName: fullName.trim(),
        email: email || null,
        phone: phone || null,
        address: address || addrQuery || null,
        city,
        postalCode,
        country: countryCode,
        state: stateCode,
        licenseNumber: licenseNumber || null,
      };

      const data = await (onSearch ?? defaultSearch)(payload);
      setResult(data);
      setConfidence(deriveConfidence(data));
      setProgress(100);

      if (data.matchType === "none") setActiveStep("noMatch");
      else if (data.matchType === "multi") setActiveStep("multi");
      else setActiveStep(2);
    } catch (e: any) {
      setError(e?.message || "Search failed");
    } finally {
      clearInterval(i);
      setTimeout(() => setProgress(0), 300);
      setIsLoading(false);
    }
  }

  async function defaultSearch(payload: SearchPayload): Promise<SearchResult> {
    const res = await fetch("/api/renters/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userId: user?.uid || null }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Search failed");
    return json;
  }

  /* ---------------------------------- BILLING / UNLOCK ---------------------------------- */
  async function tryUnlockReport(reportId: string): Promise<void> {
    if (!viewerUid) {
      setPendingAction({ type: "FULL_REPORT_UNLOCK", reportId });
      setShowAuthGate(true);
      return;
    }

    const res = await fetch("/api/reports/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        purchaser: {
          uid: viewerUid,
          mode: companyId ? "COMPANY" : "INDIVIDUAL",
          companyId: companyId || null,
        },
      }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Unlock failed");

    if (json.checkoutUrl) {
      setPendingUnlock(reportId);
      window.location.href = json.checkoutUrl;
      return;
    }

    if (json.unlocked) {
      clearPendingUnlock();
      setResult((r) => (r ? { ...r, unlocked: true } : r));
      router.push(`/report/${json.reportId || reportId}`);
    }
  }

  async function handleFullReportCheckout(): Promise<void> {
    if (!result?.preMatchedReportId) return;
    setFullReportCheckoutLoading(true);
    try {
      await tryUnlockReport(result.preMatchedReportId);
    } finally {
      setFullReportCheckoutLoading(false);
    }
  }

  async function handleIdentityCheckout(): Promise<void> {
    if (!viewerUid) {
      setPendingAction({ type: "IDENTITY_CHECK" });
      setShowAuthGate(true);
      return;
    }

    setIdentityLoading(true);

    try {
      const res = await fetch("/api/checkout/identity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "IDENTITY_CHECK",
          purchaser: {
            uid: viewerUid,
            mode: companyId ? "COMPANY" : "INDIVIDUAL",
            companyId: companyId || null,
          },
          renterPayload: {
            name: fullName,
            email: email || null,
            phone: phone || null,
            address: address || addrQuery || null,
            license: licenseNumber || null,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Checkout failed");

      const rawUrl = String(json?.url || json?.checkoutUrl || "").trim();
      if (!rawUrl) throw new Error("Missing checkoutUrl from server response.");

      const finalUrl = rawUrl.startsWith("http")
        ? rawUrl
        : `${window.location.origin}${rawUrl}`;

      // Force top-level navigation (helps in Firebase Studio iframe sandboxes)
      window.location.assign(finalUrl);
    } catch (err) {
      console.error("Identity checkout error:", err);
      alert("Unable to start identity verification checkout");
    } finally {
      setIdentityLoading(false);
    }
  }

  async function handleSelfVerify(): Promise<void> {
    try {
      setSelfVerifyLoading(true);

      const res = await fetch("/api/self-verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchSessionId: result?.id ?? null,
          renter: {
            fullName: verifyName,
            email: verifyEmail,
            phone: verifyPhone,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send");

      alert("Verification link sent!");
      setOpenSelfVerify(false);
    } catch (err: any) {
      alert(err?.message || "Failed to send verification.");
    } finally {
      setSelfVerifyLoading(false);
    }
  }

  /* -------------------------------------------------------------------------------------------------
   * MAIN MODAL WRAPPER
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
              className="bg-white shadow-2xl h-full w-full sm:max-w-lg flex flex-col relative z-[20000]"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 240, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER (single, fixed) */}
              <div className="border-b px-4 sm:px-6 py-4 relative bg-white">
                <div className="flex items-center justify-between gap-4 pr-10">
                  <div className="space-y-0.5">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Renter Search
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500">
                      AI-powered identity &amp; risk screening
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="tabular-nums font-medium text-gray-800">
                      {displayConfidence}%
                    </span>

                    <div className="w-14 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gray-900"
                        initial={{ width: 0 }}
                        animate={{ width: `${displayConfidence}%` }}
                        transition={{ type: "spring", stiffness: 160, damping: 26 }}
                      />
                    </div>

                    <span className="hidden sm:inline text-gray-400">
                      {confidenceLabel}
                    </span>
                  </div>
                </div>

                {isLoading && (
                  <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-100">
                    <div
                      className="h-full bg-gray-900 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 transition"
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* BODY */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8">
                {viewMode === "sample" ? (
                  <SampleReportMobile onBack={() => setViewMode("search")} />
                ) : (
                  <>
                    {activeStep === 1 && (
                      <div className="rounded-2xl border bg-gray-50/60 p-5 sm:p-6 shadow-sm space-y-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Renter Information
                          </h3>
                          <p className="text-sm text-gray-600">
                            Enter the details you have. More information improves accuracy.
                          </p>
                        </div>

                        <StepSearchForm
                          fullName={fullName}
                          setFullName={setFullName}
                          email={email}
                          setEmail={setEmail}
                          phone={phone}
                          setPhone={setPhone}
                          formatPhone={formatPhone}
                          useAutofill={useAutofill}
                          setUseAutofill={setUseAutofill}
                          addrQuery={addrQuery}
                          setAddrQuery={setAddrQuery}
                          address={address}
                          setAddress={setAddress}
                          suggestions={suggestions}
                          setSuggestions={setSuggestions}
                          suggestionsLoading={suggestionsLoading}
                          city={city}
                          setCity={setCity}
                          postalCode={postalCode}
                          setPostalCode={setPostalCode}
                          countryCode={countryCode}
                          setCountryCode={setCountryCode}
                          stateCode={stateCode}
                          setStateCode={setStateCode}
                          licenseNumber={licenseNumber}
                          setLicenseNumber={setLicenseNumber}
                          error={error}
                        />
                      </div>
                    )}

                    {activeStep === "multi" && (
                      <StepMultiMatch
                        result={result}
                        setActiveStep={setActiveStep as any}
                      />
                    )}

                    {activeStep === "noMatch" && (
                      <StepNoMatch
                        setActiveStep={setActiveStep as any}
                        onClose={onClose}
                      />
                    )}

                    {activeStep === 2 && (
                      <StepMatchFound
                        result={result}
                        setActiveStep={setActiveStep as any}
                        setViewMode={setViewMode}
                        handleIdentityCheckout={handleIdentityCheckout}
                        identityLoading={identityLoading}
                        setVerifyName={setVerifyName}
                        setVerifyEmail={setVerifyEmail}
                        setVerifyPhone={setVerifyPhone}
                        setOpenSelfVerify={setOpenSelfVerify}
                        fullName={fullName}
                        email={email}
                        phone={phone}
                        address={address}
                        licenseNumber={licenseNumber}
                        onClose={onClose}
                      />
                    )}

                    {activeStep === 3 && (
                      <StepRiskAndUnlock
                        result={result}
                        isReloading={isReloading}
                        setActiveStep={setActiveStep as any}
                        handleFullReportCheckout={handleFullReportCheckout}
                        fullReportCheckoutLoading={fullReportCheckoutLoading}
                        setViewMode={setViewMode}
                        onClose={onClose}
                      />
                    )}
                  </>
                )}
              </div>

              {/* FOOTER */}
              {viewMode === "search" && activeStep === 1 && (
                <div className="border-t px-4 sm:px-6 py-4 bg-white">
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full rounded-full py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                    style={{ backgroundColor: BRAND_GOLD }}
                    type="button"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Searching… {Math.round(progress)}%
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Search className="h-4 w-4" />
                        Start Search
                      </span>
                    )}
                  </button>
                </div>
              )}

              {openSelfVerify && (
                <SelfVerifyModal
                  openSelfVerify={openSelfVerify}
                  setOpenSelfVerify={setOpenSelfVerify}
                  selfVerifyLoading={selfVerifyLoading}
                  verifyName={verifyName}
                  setVerifyName={setVerifyName}
                  verifyEmail={verifyEmail}
                  setVerifyEmail={setVerifyEmail}
                  verifyPhone={verifyPhone}
                  setVerifyPhone={setVerifyPhone}
                  formatPhone={formatPhone}
                  handleSelfVerify={handleSelfVerify}
                />
              )}
            </motion.div>
          </motion.div>

          {showAuthGate && (
            <ModalAuthGate
              mode="signup"
              title="Continue to Checkout"
              subtitle="Create an account or sign in to protect renter data and keep an audit trail."
              onClose={() => {
                setShowAuthGate(false);
                setPendingAction(null);
              }}
              onAuthed={async (uid) => {
                await refreshViewerContext(uid);

                const action = pendingAction;
                setPendingAction(null);
                setShowAuthGate(false);

                if (!action) return;

                if (action.type === "IDENTITY_CHECK") {
                  await handleIdentityCheckout();
                }

                if (action.type === "FULL_REPORT_UNLOCK") {
                  await tryUnlockReport(action.reportId);
                }
              }}
            />
          )}
        </>
      )}
    </AnimatePresence>
  );
}
