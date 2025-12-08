"use client";

/* -------------------------------------------------------------------------------------------------
 *  IMPORTS
 * ------------------------------------------------------------------------------------------------*/
import { useEffect, useRef, useState } from "react";
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
  Users,
  AlertTriangle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import type { AppUser } from "@/types/user";

/* NEW RISK ENGINE IMPORTS */
import { convertToCreditRange } from "@/lib/risk/convertScore";
import type { RiskScoreResult } from "@/lib/risk/computeRiskScore";
import type { ConfidenceScoreResult } from "@/lib/risk/computeConfidenceScore";
import type { Signal } from "@/lib/risk/detectSignals";

/* -------------------------------------------------------------------------------------------------
 *  TYPES
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

  /* Unified risk object */
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
 *  CONSTANTS + HELPERS
 * ------------------------------------------------------------------------------------------------*/
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
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const CA_PROVINCES = [
  "AB","BC","MB","NB","NL","NS","NT","NU","ON","PE","QC","SK","YT",
];

const formatPhone = (val: string) => {
  const digits = val.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
};

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

/* -------------------------------------------------------------------------------------------------
 *  MAIN COMPONENT
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
  const router = useRouter();

  /* FORM STATE */
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

  /* MAPBOX AUTOFILL */
  const [useAutofill, setUseAutofill] = useState(false);
  const [addrQuery, setAddrQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /* UX STATE */
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] =
    useState<1 | 2 | 3 | "multi" | "noMatch">(1);

  const [result, setResult] = useState<SearchResult | null>(null);

  const [identityLoading, setIdentityLoading] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);

  /* Full Report Checkout */
  const [fullReportCheckoutLoading, setFullReportCheckoutLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  /* SELF VERIFY MODAL */
  const [openSelfVerify, setOpenSelfVerify] = useState(false);
  const [verifyName, setVerifyName] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: LOCK BODY SCROLL
   * ------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => {}, 60);

    return () => {
      document.body.style.overflow = orig;
      clearTimeout(id);
    };
  }, [open]);

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: CLOSE ON OUTSIDE CLICK
   * ------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    function outside(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open, onClose]);

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: MAPBOX AUTOFILL QUERY
   * ------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || !useAutofill) {
      setSuggestions([]);
      return;
    }
    if (addrQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    const t = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort();
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
        setSuggestions(Array.isArray(json.features) ? json.features : []);
      } catch {}
      finally {
        setSuggestionsLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [addrQuery, useAutofill]);

  /* -------------------------------------------------------------------------------------------------
   * SUBMIT SEARCH
   * ------------------------------------------------------------------------------------------------*/
  async function handleSubmit() {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current = clamp(current + 5 + Math.random() * 10, 0, 92);
      setProgress(current);
    }, 200);

    try {
      const payload: SearchPayload = {
        fullName: fullName.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || addrQuery.trim() || null,
        country: countryCode,
        state: stateCode,
        city,
        postalCode,
        licenseNumber: licenseNumber.trim() || null,
      };

      const fn = onSearch ?? defaultSearch;
      const data = await fn(payload);

      setResult(data);
      setProgress(100);

      if (data.matchType === "none") setActiveStep("noMatch");
      else if (data.matchType === "multi") setActiveStep("multi");
      else setActiveStep(2);

    } catch (err: any) {
      setError(err.message || "Search failed.");
    } finally {
      clearInterval(interval);
      setTimeout(() => setProgress(0), 350);
      setIsLoading(false);
    }
  }

  /* DEFAULT SEARCH FALLBACK */
  async function defaultSearch(payload: SearchPayload): Promise<SearchResult> {
    const res = await fetch("/api/renters/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, userId: user?.uid || null }),
    });

    const json = await res.json().catch(() => null);
    if (!json) throw new Error("Invalid server response.");
    if (!res.ok) throw new Error(json.error || "Search failed.");

    return json;
  }

  /* -------------------------------------------------------------------------------------------------
   * STEP 1 (SEARCH FORM)
   * ------------------------------------------------------------------------------------------------*/
  function renderStep1() {
    return (
      <div className="space-y-4 sm:space-y-5">

        {/* FULL NAME */}
        <div>
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <User className="h-4 w-4" /> Full Name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="John Doe"
          />
        </div>
        {/* EMAIL */}
        <div>
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <Mail className="h-4 w-4" /> Email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="email@example.com"
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <Phone className="h-4 w-4" /> Phone
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="(555) 555-5555"
          />
        </div>

        {/* ADDRESS — MAPBOX AUTOFILL */}
        <div>
          <label className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> Address (Mapbox)
          </label>

          <div className="mt-1 relative">

            {/* AUTOFILL SWITCH */}
            <div className="flex justify-end mb-1">
              <button
                onClick={() => {
                  setUseAutofill((v) => !v);
                  setSuggestions([]);
                }}
                className={`w-10 h-5 rounded-full relative transition ${
                  useAutofill ? "bg-gray-900" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute h-4 w-4 bg-white rounded-full top-0.5 transition ${
                    useAutofill ? "left-5" : "left-1"
                  }`}
                />
              </button>
            </div>

            <input
              value={useAutofill ? addrQuery : address}
              onChange={(e) =>
                useAutofill ? setAddrQuery(e.target.value) : setAddress(e.target.value)
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
              placeholder="123 Main St"
            />

            {/* AUTOFILL SUGGESTIONS */}
            {useAutofill && suggestions.length > 0 && (
              <div className="absolute bg-white border rounded-lg shadow-md mt-1 z-20 w-full max-h-52 overflow-auto text-sm">
                {suggestions.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => {
                      setAddress(feature.place_name);
                      setUseAutofill(false);
                      setSuggestions([]);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-50"
                  >
                    {feature.place_name}
                  </button>
                ))}
              </div>
            )}

            {useAutofill && suggestionsLoading && (
              <p className="text-[11px] text-gray-400 mt-1">Searching…</p>
            )}
          </div>
        </div>

        {/* CITY + POSTAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium">Postal Code</label>
            <input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* COUNTRY + STATE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="text-xs sm:text-sm font-medium">Country</label>
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value as any)}
              className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium">State / Province</label>
            {countryCode === "US" || countryCode === "CA" ? (
              <select
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select</option>
                {(countryCode === "US" ? US_STATES : CA_PROVINCES).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={stateCode}
                onChange={(e) => setStateCode(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="Region"
              />
            )}
          </div>
        </div>

        {/* LICENSE */}
        <div>
          <label className="text-xs sm:text-sm font-medium">License / ID Number</label>
          <input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
            className="mt-1 w-full border rounded-lg px-3 py-2 text-sm uppercase"
            placeholder="Driver License / ID"
          />
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   * STEP 2 — MATCH FOUND (Updated to remove FRAUD SCORE)
   * ------------------------------------------------------------------------------------------------*/
  function renderStep2() {
    if (!result) return null;

    const profile = result.publicProfile || {};
    const hasReport = !!result.preMatchedReportId;

    return (
      <div className="space-y-6">

        {/* BACK */}
        <button
          onClick={() => setActiveStep(1)}
          className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        {/* MATCH CARD */}
        <div className="border p-4 bg-gray-50 rounded-lg text-sm space-y-3">

          <div className="flex items-center justify-between">
            <p className="font-semibold">
              {hasReport ? "Internal Renter Report Found" : "Potential Match"}
            </p>
            <p className="text-[11px] text-gray-500">Step 2 of 3</p>
          </div>

          {/* SCORES — only Identity Score remains here */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-gray-500">Identity Score</p>
              <p className="font-semibold">
                {result.identityScore != null ? `${result.identityScore}%` : "—"}
              </p>
            </div>
          </div>

          {/* PROFILE PREVIEW */}
          <div className="border-t border-dashed pt-3 text-xs space-y-1">
            <p className="font-semibold text-gray-600">Matched Renter Preview</p>
            <p>Name: {profile.name ?? "—"}</p>
            <p>Email: {profile.email ?? "—"}</p>
            <p>Phone: {profile.phone ?? "—"}</p>
            <p>Address: {profile.address ?? "—"}</p>
            {profile.licenseNumber && <p>License: {profile.licenseNumber}</p>}
          </div>
        </div>

        {/* INFO */}
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4" />
            <p className="font-semibold text-sm">Why Identity Verification?</p>
          </div>
          <p className="text-xs text-gray-600">
            Identity verification protects you from fraudulent renters, reduces
            chargebacks, and ensures accurate reporting.
          </p>
        </div>

        {/* IDENTITY CHECK */}
        <button
          onClick={handleIdentityCheckout}
          disabled={identityLoading}
          className="w-full border border-gray-900 rounded-full px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white disabled:opacity-50"
        >
          {identityLoading && <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />}
          Identity Check ($4.99)
        </button>

        {/* SELF VERIFY */}
        <button
          onClick={() => {
            setVerifyName(profile.name ?? fullName);
            setVerifyEmail(profile.email ?? email);
            setVerifyPhone(profile.phone ?? phone);
            setOpenSelfVerify(true);
          }}
          className="w-full border border-gray-300 rounded-full px-3 py-2 text-xs font-semibold hover:bg-gray-100"
        >
          <Send className="inline h-3 w-3 mr-2" />
          Send Self-Verification
        </button>

        {/* CONTINUE */}
        <button
          onClick={() => setActiveStep(3)}
          className="w-full bg-gray-900 text-white rounded-full px-3 py-2 text-xs font-semibold hover:bg-black"
        >
          Continue
        </button>

      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   * STEP 3 — RISK SCORE MODULE INSERTED HERE
   * ------------------------------------------------------------------------------------------------*/
  function renderStep3() {
    if (!result) return null;

    const hasReport = !!result.preMatchedReportId;
    const isUnlocked = result.unlocked === true;

    /* Stripe reload state */
    if (isReloading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <p className="mt-3 text-sm text-gray-600">Verifying purchase…</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">

        {/* -------------------------------------------------------------- */}
        {/*  ⭐ INSERTED: RENTER RISK SCORE MODULE (300–900 scale) */}
        {/* -------------------------------------------------------------- */}
        {result.risk?.riskScore?.score !== undefined && (
          <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
            <p className="text-xs font-semibold text-gray-700">
              Renter Risk Score
            </p>

            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">
                {convertToCreditRange(result.risk.riskScore.score)}
              </p>

              <div
                className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                  result.risk.riskScore.score > 75
                    ? "bg-green-100 text-green-800"
                    : result.risk.riskScore.score > 50
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {result.risk.riskScore.score > 75
                  ? "Low Risk"
                  : result.risk.riskScore.score > 50
                  ? "Moderate Risk"
                  : "High Risk"}
              </div>
            </div>

            {/* Confidence Score */}
            {result.risk?.confidenceScore?.score !== undefined && (
              <div className="border-t pt-3">
                <p className="text-xs font-semibold text-gray-700">
                  Confidence Score
                </p>
                <p className="text-md font-medium text-gray-900">
                  {convertToCreditRange(result.risk.confidenceScore.score)}
                </p>
                <p className="text-[11px] text-gray-600">
                  Based on identity verification, patterns & behavioral signals.
                </p>
              </div>
            )}
          </div>
        )}

        {/* BACK */}
        <button
          onClick={() => setActiveStep(2)}
          className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
        {/* INFO CARD */}
        <div className="border bg-gray-50 rounded-lg p-4 text-sm space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Next Step</p>
            <p className="text-[11px] text-gray-500">Step 3 of 3</p>
          </div>

          {!hasReport && (
            <p className="text-xs text-gray-600">
              No internal RentFAX report exists yet.  
              You can verify the renter’s identity or send a self-verification request.
            </p>
          )}

          {hasReport && !isUnlocked && (
            <p className="text-xs text-gray-600">
              This renter has a RentFAX history.  
              Unlock the full report to view incidents, disputes, payments, and AI insights.
            </p>
          )}

          {hasReport && isUnlocked && (
            <p className="text-xs text-gray-600">
              Full report unlocked!  
              View incident timeline and risk analytics.
            </p>
          )}
        </div>

        {/* ACTION BUTTONS */}
          {!hasReport ? (
        <>
          {/* IDENTITY CHECK */}
          <button
            onClick={handleIdentityCheckout}
            disabled={identityLoading}
            className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white disabled:opacity-50"
          >
            {identityLoading && (
              <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
            )}
            Identity Check ($4.99)
          </button>

    {/* SELF VERIFY */}
        <button
      onClick={() => {
        setVerifyName(result?.publicProfile?.name ?? fullName);
        setVerifyEmail(result?.publicProfile?.email ?? email);
        setVerifyPhone(result?.publicProfile?.phone ?? phone);
        setOpenSelfVerify(true);
      }}
      className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
    >
      Send Self-Verification
    </button>
  </>
) : !isUnlocked ? (
  <>
    {/* FULL REPORT UNLOCK */}
    <button
      onClick={handleFullReportCheckout}
      disabled={fullReportCheckoutLoading}
      className="w-full rounded-full bg-gray-900 text-white px-3 py-2 text-xs font-semibold hover:bg-black disabled:opacity-50"
    >
      {fullReportCheckoutLoading && (
        <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
      )}
      Unlock Full Report ($20)
    </button>

    <p className="text-[11px] text-center text-gray-500">
      Includes incidents, disputes, balances owed, and AI-powered summary.
    </p>
  </>
) : (
  <>
    {/* VIEW REPORT */}
    <button
      onClick={() => router.push(`/report/${result.preMatchedReportId}`)}
      className="w-full rounded-full bg-green-600 text-white px-3 py-2 text-xs font-semibold hover:bg-green-700"
    >
      View Full Report
    </button>
  </>
)}

/* ⭐ SAMPLE REPORT MUST BE OUTSIDE OF ALL CONDITION BLOCKS */
<button
  onClick={() => router.push("/report/sample")}
  className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100 mt-2"
>
  View Sample Report (Demo)
</button>


        {/* CLOSE */}
        <button
          onClick={onClose}
          className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
        >
          Close
        </button>
      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   * SELF-VERIFICATION MODAL
   * ------------------------------------------------------------------------------------------------*/
  function SelfVerifyModal() {
    if (!openSelfVerify) return null;

    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* CLOSE */}
            <button
              onClick={() => setOpenSelfVerify(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold">Send Verification Request</h3>
            <p className="text-sm text-gray-600 mb-4">
              A secure verification link will be sent via email or SMS.
            </p>

            {/* NAME */}
            <div className="mb-3">
              <label className="text-xs font-medium">Full Name</label>
              <input
                value={verifyName}
                onChange={(e) => setVerifyName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="text-xs font-medium">Email</label>
              <input
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* PHONE */}
            <div className="mb-4">
              <label className="text-xs font-medium">Phone</label>
              <input
                value={verifyPhone}
                onChange={(e) => setVerifyPhone(formatPhone(e.target.value))}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* SEND */}
            <button
              disabled={selfVerifyLoading}
              onClick={async () => {
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
                  alert(err.message || "Failed to send verification.");
                } finally {
                  setSelfVerifyLoading(false);
                }
              }}
              className="w-full bg-gray-900 text-white rounded-full py-2 text-sm font-semibold hover:bg-black disabled:opacity-50"
            >
              {selfVerifyLoading ? "Sending…" : "Send Verification Link"}
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   * MAIN MODAL WRAPPER
   * ------------------------------------------------------------------------------------------------*/
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[15000] bg-black/60 backdrop-blur-sm flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
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
            {/* HEADER */}
            <div className="border-b px-4 sm:px-6 py-4 relative">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-semibold">Renter Search</h2>
                  <p className="text-sm text-gray-600">
                    AI-powered identity & risk screening
                  </p>
                </div>

                {/* CONFIDENCE BADGE */}
                <div className="rounded-full border px-3 py-1 text-[11px] font-medium flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                  Confidence
                </div>
              </div>

              {/* PROGRESS BAR */}
              {isLoading && (
                <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-gray-100">
                  <div
                    className="h-full bg-gray-900 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              {/* CLOSE */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8">
              {activeStep === 1 && renderStep1()}
              {activeStep === "multi" && renderMultiMatch()}
              {activeStep === "noMatch" && renderNoMatch()}
              {activeStep === 2 && renderStep2()}
              {activeStep === 3 && renderStep3()}
            </div>

            {/* FOOTER: Step 1 CTA */}
            {activeStep === 1 && (
              <div className="border-t px-4 sm:px-6 py-4 bg-white">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full rounded-full py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                  style={{ backgroundColor: BRAND_GOLD }}
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

                <p className="text-center text-xs text-gray-600 mt-2.5">
                  Already have an account?{" "}
                  <a href="/login" className="underline text-gray-900">
                    Log in
                  </a>
                </p>
              </div>
            )}
          </motion.div>

          {/* SELF VERIFY MODAL */}
          {openSelfVerify && <SelfVerifyModal />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
