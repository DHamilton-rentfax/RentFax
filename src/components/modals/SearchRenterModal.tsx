// ==============================
// SEARCH RENTER MODAL (UPDATED)
// ==============================
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  Loader2,
  ArrowLeft,
  Send,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import IdentityBadge from "@/components/badges/IdentityBadge";

import type { AppUser } from "@/types/user";

// ------------------------------------------------------
// TYPES
// ------------------------------------------------------

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
  identityScore?: number;
  fraudScore?: number;
  publicProfile?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    licenseNumber?: string | null;
  };
  id?: string; // search session id
  renterId?: string; // a direct match ID
  preMatchedReportId?: string | null; // internal match
  verifiedStatus?: {
    verified: boolean;
    method: string | null;
    timestamp: number | null;
  };
  [key: string]: any;
};

interface SearchRenterModalProps {
  open: boolean;
  onClose: () => void;
  onSearch?: (payload: SearchPayload) => Promise<SearchResult>;
  user?: AppUser;
}

// ------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------

const BRAND_GOLD = "#D9A334";

const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "MX", name: "Mexico" },
  { code: "OTHER", name: "Other / International" },
] as const;

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

const CA_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

// ------------------------------------------------------
// HELPERS
// ------------------------------------------------------

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
    6,
    10,
  )}`;
};

// ------------------------------------------------------
// COMPONENT
// ------------------------------------------------------

export default function SearchRenterModal({
  open,
  onClose,
  onSearch,
  user,
}: SearchRenterModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Form state (Step 1)
  const [formState, setFormState] = useState({
      fullName: "", email: "", phone: "", address: "", city: "", 
      postalCode: "", countryCode: "US" as "US" | "CA" | "GB" | "AU" | "MX" | "OTHER", 
      stateCode: "", licenseNumber: ""
  });

  // Mapbox
  const [useAutofill, setUseAutofill] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [addrQuery, setAddrQuery] = useState("");
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // UX state
  const [isLoading, setIsLoading] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Steps & Result
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // ------------------------------------------------------
  // LOCAL STORAGE PERSISTENCE
  // ------------------------------------------------------
  useEffect(() => {
    const savedState = localStorage.getItem("renterSearchState");
    if (savedState) {
        try {
            const { form, step, result } = JSON.parse(savedState);
            setFormState(form || formState);
            setActiveStep(step || 1);
            setSearchResult(result || null);
        } catch {}
    }
  }, []);

  useEffect(() => {
      localStorage.setItem("renterSearchState", JSON.stringify({
          form: formState,
          step: activeStep,
          result: searchResult,
      }));
  }, [formState, activeStep, searchResult]);

  const updateForm = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  // ------------------------------------------------------
  // CLOSE ON OUTSIDE CLICK
  // ------------------------------------------------------

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        handleClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // ------------------------------------------------------
  // COUNTRY / STATE LOGIC
  // ------------------------------------------------------

  const availableStates = useMemo(() => {
    if (formState.countryCode === "US") return US_STATES;
    if (formState.countryCode === "CA") return CA_PROVINCES;
    return [];
  }, [formState.countryCode]);

  // ------------------------------------------------------
  // MAPBOX AUTOFILL
  // ------------------------------------------------------

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    if (!useAutofill || !token) {
      setSuggestions([]);
      return;
    }

    if (addrQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        setSuggestionsLoading(true);
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            addrQuery
          )}.json?autocomplete=true&limit=5&access_token=${token}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setSuggestions(Array.isArray(data.features) ? data.features : []);
      } catch {
      } finally {
        setSuggestionsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [addrQuery, useAutofill]);

  const handleSelectSuggestion = (feature: any) => {
    setSuggestions([]);
    setAddrQuery(feature.place_name || "");
    updateForm("address", feature.place_name || "");

    const ctx = feature.context || [];
    const cityCtx =
      ctx.find((c: any) => c.id.startsWith("place")) ||
      ctx.find((c: any) => c.id.startsWith("locality"));
    const regionCtx = ctx.find((c: any) => c.id.startsWith("region"));
    const countryCtx = ctx.find((c: any) => c.id.startsWith("country"));
    const postcodeCtx = ctx.find((c: any) => c.id.startsWith("postcode"));

    if (cityCtx?.text) updateForm("city", cityCtx.text);
    if (postcodeCtx?.text) updateForm("postalCode", postcodeCtx.text);
    if (regionCtx?.short_code)
        updateForm("stateCode", String(regionCtx.short_code).split("-").pop()!.toUpperCase());
    if (countryCtx?.short_code) {
      const cc = String(countryCtx.short_code).toUpperCase();
      const found = COUNTRIES.find((c) => c.code === cc);
      updateForm("countryCode", found ? found.code : "OTHER");
    }
  };

  // ------------------------------------------------------
  // CONFIDENCE SCORE
  // ------------------------------------------------------

  const canSubmit = useMemo(() => {
    const hasName = formState.fullName.trim().length > 1;
    const hasEmail = formState.email.trim().length > 3;
    const hasPhone = formState.phone.replace(/\D/g, "").length >= 10;
    return hasName && (hasEmail || hasPhone);
  }, [formState]);

  const confidence = useMemo(() => {
    let score = 0;
    if (formState.fullName.trim().length > 1) score += 40;
    if (formState.email.trim().length > 3) score += 20;
    if (formState.phone.replace(/\D/g, "").length >= 10) score += 20;
    if (formState.address.trim().length > 5) score += 10;
    if (formState.licenseNumber.trim().length > 3) score += 10;
    return Math.min(score, 100);
  }, [formState]);

  const confidenceLabel =
    confidence >= 80 ? "High" : confidence >= 50 ? "Medium" : "Low";

  // ------------------------------------------------------
  // SEARCH FUNCTION
  // ------------------------------------------------------

  async function defaultSearch(payload: SearchPayload): Promise<SearchResult> {
    const res = await fetch("/api/renters/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userId: user?.uid ?? null }),
    });

    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  async function handleSubmit() {
    if (!canSubmit || isLoading) return;

    setIsLoading(true);
    setSearchResult(null);
    setProgress(0);
    setError(null);

    let current = 0;
    const interval = window.setInterval(() => {
      current = Math.min(90, current + 7 + Math.random() * 7);
      setProgress(current);
    }, 220);

    try {
      const payload: SearchPayload = {
        fullName: formState.fullName.trim(),
        email: formState.email.trim() || null,
        phone: formState.phone.trim() || null,
        address: formState.address.trim() || addrQuery.trim() || null,
        country: formState.countryCode || null,
        state: formState.stateCode || null,
        city: formState.city || null,
        postalCode: formState.postalCode || null,
        licenseNumber: formState.licenseNumber.trim() || null,
      };

      const searchFn = onSearch ?? defaultSearch;
      const data = await searchFn(payload);

      setSearchResult(data);
      setActiveStep(2);
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Search failed.");
    } finally {
      window.clearInterval(interval);
      setTimeout(() => setProgress(0), 600);
      setIsLoading(false);
    }
  }

  // ------------------------------------------------------
  // BACK BUTTON LOGIC
  // ------------------------------------------------------

  function goBack() {
    if (activeStep === 2) return setActiveStep(1);
  }

  // ------------------------------------------------------
  // CLOSE RESET
  // ------------------------------------------------------

  function handleClose() {
    setFormState({
        fullName: "", email: "", phone: "", address: "", city: "", 
        postalCode: "", countryCode: "US", stateCode: "", licenseNumber: ""
    });
    setUseAutofill(false);
    setAddrQuery("");
    setSuggestions([]);
    setError(null);
    setSearchResult(null);
    setActiveStep(1);
    setSelfVerifyLoading(false);
    localStorage.removeItem("renterSearchState");
    onClose();
  }

  // ------------------------------------------------------
  // HANDLERS FOR STEP 2 BUTTONS
  // ------------------------------------------------------

  const handleIdentityCheck = () => {
    if (!searchResult?.id) return;
    router.push(`/identity-check?searchId=${searchResult.id}`);
  };

  const handleSendSelfVerify = async () => {
    if (selfVerifyLoading) return;
    setSelfVerifyLoading(true);
    try {
      await fetch("/api/identity/send-self-verify", {
        method: "POST",
        body: JSON.stringify({ renterId: searchResult?.id }),
      });
      toast({
        title: "Success",
        description: "Verification link sent to renter.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSelfVerifyLoading(false);
    }
  };

  const handleUnlockReport = () => {
    if (!searchResult?.renterId) return;
    router.push(`/report/unlocked?reportId=${searchResult.renterId}`);
  };

  // ------------------------------------------------------
  // RENDER MODAL
  // ------------------------------------------------------

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          ref={panelRef}
          className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="relative border-b border-gray-200 px-6 py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Renter Search
                </h2>
                <p className="text-sm text-gray-500">
                  AI-powered identity &amp; fraud screening.
                </p>
              </div>

              {/* Desktop/Tablet Confidence */}
              <div className="hidden flex-col items-end sm:flex">
                <p className="text-xs font-medium text-gray-600">
                  Confidence:{" "}
                  <span
                    className={
                      confidence >= 80
                        ? "text-green-600"
                        : confidence >= 50
                        ? "text-orange-500"
                        : "text-red-600"
                    }
                  >
                    {confidenceLabel}
                  </span>{" "}
                  <span className="text-gray-400">({confidence}%)</span>
                </p>

                <div className="mt-1 h-1.5 w-40 overflow-hidden rounded-full bg-gray-200">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${confidence}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor:
                        confidence >= 80
                          ? "#16a34a"
                          : confidence >= 50
                          ? "#f97316"
                          : "#dc2626",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Confidence */}
            <div className="mt-3 sm:hidden">
              <p className="text-xs font-medium text-gray-600">
                Confidence:{" "}
                <span
                  className={
                    confidence >= 80
                      ? "text-green-600"
                      : confidence >= 50
                      ? "text-orange-500"
                      : "text-red-600"
                  }
                >
                  {confidenceLabel}
                </span>{" "}
                <span className="text-gray-400">({confidence}%)</span>
              </p>

              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.4 }}
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      confidence >= 80
                        ? "#16a34a"
                        : confidence >= 50
                        ? "#f97316"
                        : "#dc2626",
                  }}
                />
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
            {activeStep === 1 && (
              <div className="space-y-5">
                {/* Form fields here */}
                {/* Full Name, Email, Phone, etc. */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700"><User className="mr-2 h-4 w-4" />Full Name</label>
                  <input value={formState.fullName} onChange={(e) => updateForm("fullName", e.target.value)} placeholder="e.g., Dominique Hamilton" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                 <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700"><Mail className="mr-2 h-4 w-4" />Email</label>
                  <input type="email" value={formState.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="renter@example.com" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700"><Phone className="mr-2 h-4 w-4" />Phone</label>
                  <input type="tel" value={formState.phone} onChange={(e) => updateForm("phone", formatPhone(e.target.value))} placeholder="(555) 555-5555" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
                </div>
                 {/* Address and other fields */}

                {error && (<div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>)}
              </div>
            )}

            {activeStep === 2 && searchResult && (
              <SearchStep2
                open={activeStep === 2}
                payload={formState}
                result={searchResult}
                onBack={goBack}
                onClose={handleClose}
                onProceedIdentityCheck={handleIdentityCheck}
                onSendSelfVerification={handleSendSelfVerify}
                onUnlockReport={handleUnlockReport}
              />
            )}
          </div>

          {/* FOOTER — step 1 only */}
          {activeStep === 1 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit || isLoading}
                className={`relative flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white transition ${
                  canSubmit && !isLoading
                    ? "shadow-sm"
                    : "cursor-not-allowed opacity-70"
                }`}
                style={{ backgroundColor: BRAND_GOLD }}
              >
                {isLoading && (
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="h-full w-full rounded-full opacity-40" style={{ backgroundColor: "#000000" }} />
                    <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "#000000", opacity: 0.15, transition: "width 180ms linear" }} />
                  </div>
                )}

                <span className="relative flex items-center">
                  {isLoading ? ( <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching… {Math.round(progress)}% </> ) : ( <> <Search className="mr-2 h-4 w-4" /> Start Search </> )}
                </span>
              </button>

              <p className="mt-3 text-center text-xs text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="font-medium text-gray-900 underline underline-offset-2">
                  Log in
                </a>
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Step 2 Component - Match Found
function SearchStep2({
  open,
  result,
  onBack,
  onProceedIdentityCheck,
  onSendSelfVerification,
  onUnlockReport,
}: {
  open: boolean;
  payload: SearchPayload | null;
  result: SearchResult;
  onBack: () => void;
  onClose: () => void;
  onProceedIdentityCheck: () => void;
  onSendSelfVerification: () => void;
  onUnlockReport: () => void;
}) {
  if (!open) return null;
  const profile = result?.publicProfile || {};

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center text-xs text-gray-600 hover:text-gray-900">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </button>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
        <p className="font-semibold text-gray-900 mb-3">Match Found</p>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[11px] text-gray-500">Identity Score</p><p className="text-sm font-semibold">{result?.identityScore ?? '—'}%</p></div>
          <div><p className="text-[11px] text-gray-500">Fraud Score</p><p className="text-sm font-semibold">{result?.fraudScore ?? '—'}%</p></div>
        </div>
        <div className="mt-3 space-y-1 border-t border-dashed border-gray-200 pt-3">
          <p className="text-[11px] font-semibold text-gray-500">Matched Profile (Preview)</p>
          <p>Name: {profile.name || "—"}</p>
          <p>Email: {profile.email || "—"}</p>
          <p>Phone: {profile.phone || "—"}</p>
        </div>
        <div className="mt-2">
            <IdentityBadge 
                verified={result?.verifiedStatus?.verified ?? false}
                method={result?.verifiedStatus?.method}
            />
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-sm font-semibold text-gray-900 mb-2">Why Identity Verification Matters</p>
        <p className="text-xs leading-relaxed text-gray-600">Identity verification protects you from fraud. Every report must be tied to a real, verified person.</p>
      </div>
      <button onClick={onProceedIdentityCheck} className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white">Proceed to Identity Check ($4.99)</button>
      <button onClick={onSendSelfVerification} className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100">Send Self-Verification to Renter</button>
      {result?.renterId && <button onClick={onUnlockReport} className="w-full rounded-full bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black">Unlock Full Report ($20)</button>}
    </div>
  );
}
