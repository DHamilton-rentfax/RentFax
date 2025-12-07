
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
  preMatchedReportId?: string | null; // internal match
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
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const CA_PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
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
    10
  )}`;
};

// ------------------------------------------------------
// COMPONENT
// ------------------------------------------------------

export default function SearchRenterModalMaster({
  open,
  onClose,
  onSearch,
  user,
}: SearchRenterModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Form state (Step 1)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [countryCode, setCountryCode] =
    useState<"US" | "CA" | "GB" | "AU" | "MX" | "OTHER">("US");
  const [stateCode, setStateCode] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  // Mapbox
  const [useAutofill, setUseAutofill] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [addrQuery, setAddrQuery] = useState("");
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // UX state
  const [isLoading, setIsLoading] = useState(false); // search loading
  const [identityLoading, setIdentityLoading] = useState(false); // $4.99 flow
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false); // send link
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Steps
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [result, setResult] = useState<SearchResult | null>(null);

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

  // Reset on open
  useEffect(() => {
    if (!open) return;
    setError(null);
    setResult(null);
    setActiveStep(1);
  }, [open]);

  // ------------------------------------------------------
  // COUNTRY / STATE LOGIC
  // ------------------------------------------------------

  const availableStates = useMemo(() => {
    if (countryCode === "US") return US_STATES;
    if (countryCode === "CA") return CA_PROVINCES;
    return [];
  }, [countryCode]);

  // ------------------------------------------------------
  // MAPBOX AUTOFILL
  // ------------------------------------------------------

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
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
    setAddress(feature.place_name || "");

    const ctx = feature.context || [];
    const cityCtx =
      ctx.find((c: any) => c.id.startsWith("place")) ||
      ctx.find((c: any) => c.id.startsWith("locality"));
    const regionCtx = ctx.find((c: any) => c.id.startsWith("region"));
    const countryCtx = ctx.find((c: any) => c.id.startsWith("country"));
    const postcodeCtx = ctx.find((c: any) => c.id.startsWith("postcode"));

    if (cityCtx?.text) setCity(cityCtx.text);
    if (postcodeCtx?.text) setPostalCode(postcodeCtx.text);
    if (regionCtx?.short_code)
      setStateCode(
        String(regionCtx.short_code).split("-").pop()!.toUpperCase()
      );
    if (countryCtx?.short_code) {
      const cc = String(countryCtx.short_code).toUpperCase();
      const found = COUNTRIES.find((c) => c.code === cc);
      setCountryCode(found ? found.code : "OTHER");
    }
  };

  // ------------------------------------------------------
  // CONFIDENCE SCORE
  // ------------------------------------------------------

  const canSubmit = useMemo(() => {
    const hasName = fullName.trim().length > 1;
    const hasEmail = email.trim().length > 3;
    const hasPhone = phone.replace(/\D/g, "").length >= 10;
    return hasName && (hasEmail || hasPhone);
  }, [fullName, email, phone]);

  const confidence = useMemo(() => {
    let score = 0;
    if (fullName.trim().length > 1) score += 40;
    if (email.trim().length > 3) score += 20;
    if (phone.replace(/\D/g, "").length >= 10) score += 20;
    if (address.trim().length > 5) score += 10;
    if (licenseNumber.trim().length > 3) score += 10;
    return Math.min(score, 100);
  }, [fullName, email, phone, address, licenseNumber]);

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
    setResult(null);
    setProgress(0);
    setError(null);

    let current = 0;
    const interval = window.setInterval(() => {
      current = Math.min(90, current + 7 + Math.random() * 7);
      setProgress(current);
    }, 220);

    try {
      const payload: SearchPayload = {
        fullName: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || addrQuery.trim() || null,
        country: countryCode || null,
        state: stateCode || null,
        city: city || null,
        postalCode: postalCode || null,
        licenseNumber: licenseNumber.trim() || null,
      };

      const searchFn = onSearch ?? defaultSearch;
      const data = await searchFn(payload);

      setResult(data || {});
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
    if (activeStep === 3) return setActiveStep(2);
  }

  // ------------------------------------------------------
  // CLOSE RESET
  // ------------------------------------------------------

  function handleClose() {
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setCountryCode("US");
    setStateCode("");
    setCity("");
    setPostalCode("");
    setLicenseNumber("");
    setUseAutofill(false);
    setAddrQuery("");
    setSuggestions([]);
    setError(null);
    setResult(null);
    setActiveStep(1);
    setIdentityLoading(false);
    setSelfVerifyLoading(false);
    onClose();
  }

  // ------------------------------------------------------
  // SEND SELF-VERIFICATION TRIGGER
  // ------------------------------------------------------

  async function handleSendSelfVerify() {
    if (selfVerifyLoading) return;

    try {
      setSelfVerifyLoading(true);
      setError(null);

      const res = await fetch("/api/self-verify/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchSessionId: result?.id || null,
          renter: {
            fullName: fullName.trim() || null,
            email: email.trim() || null,
            phone: phone.trim() || null,
          },
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to send self-verification link.");
      }

      alert("Self-verification link sent to the renter.");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to send self-verification link.");
    } finally {
      setSelfVerifyLoading(false);
    }
  }

  // ------------------------------------------------------
  // UNLOCK FULL REPORT TRIGGER (stub for later)
  // ------------------------------------------------------

  async function handleUnlockReport() {
    alert("Full report purchase ($20) will be wired in the next phase.");
  }

  // ------------------------------------------------------
  // IDENTITY CHECK PURCHASE ($4.99)
// ------------------------------------------------------

  async function handleIdentityCheckout() {
    if (identityLoading) return;

    try {
      setIdentityLoading(true);
      setError(null);

      const res = await fetch("/api/identity/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchSessionId: result?.id || null,
          renter: {
            fullName: fullName.trim() || null,
            email: email.trim() || null,
            phone: phone.trim() || null,
          },
          context: user?.role || "UNKNOWN",
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to start identity check.");
      }

      const data = await res.json();
      if (!data?.url) {
        throw new Error("Missing checkout URL from server.");
      }

      window.location.href = data.url as string;
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to start identity check.");
    } finally {
      setIdentityLoading(false);
    }
  }

  // ------------------------------------------------------
  // STEP 2 — MATCH FOUND + EDUCATION BLOCK (Option 3 applied)
  // ------------------------------------------------------

  function renderStep2() {
    if (!result) return null;
    const identityScore = result.identityScore;
    const fraudScore = result.fraudScore;
    const profile = result.publicProfile || {};
    const matched = !!result.preMatchedReportId;

    return (
      <div className="space-y-5">
        {/* Back button */}
        <button
          onClick={goBack}
          className="flex items-center text-xs text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>

        {/* Summary card */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-gray-900">
              {matched ? "Internal Match Found" : "Match Found"}
            </p>
            <p className="text-[11px] text-gray-500">Step 2 of 3</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-gray-500">Identity Score</p>
              <p className="text-sm font-semibold">
                {identityScore != null ? `${identityScore}%` : "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-gray-500">Fraud Score</p>
              <p className="text-sm font-semibold">
                {fraudScore != null ? `${fraudScore}%` : "—"}
              </p>
            </div>
          </div>

          {/* Profile */}
          <div className="mt-3 space-y-1 border-t border-dashed border-gray-200 pt-3">
            <p className="text-[11px] font-semibold text-gray-500">
              Matched Profile (Preview)
            </p>
            <p>Name: {profile.name || "—"}</p>
            <p>Email: {profile.email || "—"}</p>
            <p>Phone: {profile.phone || "—"}</p>
            <p>Address: {profile.address || "—"}</p>
            {profile.licenseNumber && <p>License: {profile.licenseNumber}</p>}
          </div>
        </div>

        {/* EDUCATION BLOCK */}
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4 text-gray-800" />
            <p className="text-sm font-semibold text-gray-900">
              Why Identity Verification Matters
            </p>
          </div>

          <p className="text-xs leading-relaxed text-gray-600">
            Identity verification protects you from fraud, false information,
            and costly mistakes. Every report on RentFAX must be tied to a real,
            verified person — ensuring accuracy, fairness, and trust.
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <button
          onClick={handleIdentityCheckout}
          disabled={identityLoading}
          className="flex w-full items-center justify-center rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {identityLoading && (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          )}
          Proceed to Identity Check ($4.99)
        </button>

        <button
          onClick={handleSendSelfVerify}
          disabled={selfVerifyLoading}
          className="flex w-full items-center justify-center rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {selfVerifyLoading ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Send className="mr-2 h-3 w-3" />
          )}
          Send Self-Verification to Renter
        </button>
      </div>
    );
  }

  // ------------------------------------------------------
  // STEP 3 — FULL REPORT (still mostly UX for now)
// ------------------------------------------------------

  function renderStep3() {
    const hasInternalReport = !!result?.preMatchedReportId;

    return (
      <div className="space-y-5">
        {/* Back */}
        <button
          onClick={goBack}
          className="flex items-center text-xs text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold text-gray-900">Next Step</p>
            <p className="text-[11px] text-gray-500">Step 3 of 3</p>
          </div>

          {!hasInternalReport && (
            <p className="text-xs text-gray-600">
              No internal reports were found for this renter. You may still
              unlock a verified identity match and generate a full RentFAX fraud
              &amp; history report once identity is confirmed.
            </p>
          )}

          {hasInternalReport && (
            <p className="text-xs text-gray-600">
              A matched RentFAX identity was found. You may now purchase the
              full report.
            </p>
          )}
        </div>

        <button
          onClick={handleUnlockReport}
          className="w-full rounded-full bg-gray-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-black"
        >
          Unlock Full Report ($20)
        </button>

        <button
          onClick={handleClose}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    );
  }

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
          transition={{ type: "spring", stiffness: 260, damping: 30 }}
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
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="mr-2 h-4 w-4" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Dominique Hamilton"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="renter@example.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="mr-2 h-4 w-4" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(555) 555-5555"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>

                {/* Address autofill */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="mr-2 h-4 w-4" />
                      Address Autofill (Mapbox)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setUseAutofill((v) => !v);
                        setSuggestions([]);
                      }}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        useAutofill ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                          useAutofill ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={useAutofill ? addrQuery : address}
                      onChange={(e) =>
                        useAutofill
                          ? setAddrQuery(e.target.value)
                          : setAddress(e.target.value)
                      }
                      placeholder="123 Main St"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />

                    {useAutofill && suggestions.length > 0 && (
                      <div className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                        {suggestions.map((feature) => (
                          <button
                            key={feature.id}
                            onClick={() => handleSelectSuggestion(feature)}
                            className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100"
                          >
                            {feature.place_name}
                          </button>
                        ))}
                      </div>
                    )}

                    {useAutofill && suggestionsLoading && (
                      <p className="mt-1 text-xs text-gray-400">
                        Searching addresses…
                      </p>
                    )}
                  </div>
                </div>

                {/* Country/State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value as any)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    {availableStates.length ? (
                      <select
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="">Select</option>
                        {availableStates.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={stateCode}
                        onChange={(e) => setStateCode(e.target.value)}
                        placeholder="State / Region"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                </div>

                {/* City / Postal */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="ZIP / Postal"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                {/* License */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    License / ID Number (optional)
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) =>
                      setLicenseNumber(e.target.value.toUpperCase())
                    }
                    placeholder="Driver license / ID / Passport"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                    {error}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {activeStep === 2 && renderStep2()}

            {/* STEP 3 */}
            {activeStep === 3 && renderStep3()}
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
                    <div
                      className="h-full w-full rounded-full opacity-40"
                      style={{ backgroundColor: "#000000" }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: "#000000",
                        opacity: 0.15,
                        transition: "width 180ms linear",
                      }}
                    />
                  </div>
                )}

                <span className="relative flex items-center">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching… {Math.round(progress)}%
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Start Search
                    </>
                  )}
                </span>
              </button>

              <p className="mt-3 text-center text-xs text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-gray-900 underline underline-offset-2"
                >
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