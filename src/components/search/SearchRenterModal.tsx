"use client";

/* -------------------------------------------------------------------------------------------------
 *  IMPORTS
 * ------------------------------------------------------------------------------------------------*/
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
  Users,
  AlertTriangle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import type { AppUser } from "@/types/user";

/* -------------------------------------------------------------------------------------------------
 *  TYPES
 *  Updated SearchResult includes:
 *   - unlocked: boolean (for full report access)
 *   - fullReport: full report payload returned after unlock
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
  fraudScore?: number;

  unlocked?: boolean;       // <-- added for full report
  fullReport?: any;         // <-- added for full report payload

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
 *  CONSTANTS
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

/* -------------------------------------------------------------------------------------------------
 *  HELPERS
 * ------------------------------------------------------------------------------------------------*/
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
 *  MAIN COMPONENT START
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

  /* -------------------------------------------------------------
   * REFS
   * -----------------------------------------------------------*/
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  /* -------------------------------------------------------------
   * FORM STATE
   * -----------------------------------------------------------*/
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

  /* -------------------------------------------------------------
   * MAPBOX AUTOFILL
   * -----------------------------------------------------------*/
  const [useAutofill, setUseAutofill] = useState(false);
  const [addrQuery, setAddrQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  /* -------------------------------------------------------------
   * UX STATE
   * -----------------------------------------------------------*/
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] =
    useState<1 | 2 | 3 | "multi" | "noMatch">(1);

  const [result, setResult] = useState<SearchResult | null>(null);

  const [identityLoading, setIdentityLoading] = useState(false);
  const [selfVerifyLoading, setSelfVerifyLoading] = useState(false);

  /* Enterprise Unlock State */
  const [fullReportCheckoutLoading, setFullReportCheckoutLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  /* SELF-VERIFY MODAL STATE */
  const [openSelfVerify, setOpenSelfVerify] = useState(false);
  const [verifyName, setVerifyName] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: LOCK BODY SCROLL WHEN MODAL OPENS
   * ------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    if (!open) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const id = setTimeout(() => firstFieldRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = orig;
      clearTimeout(id);
    };
  }, [open]);

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: KEYBOARD HANDLING (ENTER to submit on Step 1)
   * ------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key === "Enter" && activeStep === 1 && !isLoading) handleSubmit();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, activeStep, isLoading, onClose]);

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: CLOSE MODAL WHEN CLICKING OUTSIDE PANEL
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
   * EFFECT: MAPBOX AUTOFILL FETCH
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
      } catch {
        /* Ignore abort errors */
      } finally {
        setSuggestionsLoading(false);
      }
    }, 250);

    return () => clearTimeout(t);
  }, [addrQuery, useAutofill]);

  /* -------------------------------------------------------------------------------------------------
   * EFFECT: STRIPE CHECKOUT REDIRECT HANDLER
   *  Detects ?session_id= and reloads renter data to show unlocked report
   * ------------------------------------------------------------------------------------------------*/
  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");

    if (!sessionId || !result?.id) return;

    async function verifyAndReload() {
      setIsReloading(true);
      try {
        // Call backend session validator
        const status = await fetch(
          `/api/checkout/session-status?session_id=${sessionId}`
        ).then((r) => r.json());

        if (status?.success) {
          // Reload search result from backend with unlocked state
          const refreshed = await fetch(
            `/api/renters/result?id=${result.id}`
          ).then((r) => r.json());

          setResult(refreshed);
          setActiveStep(3);

          // Remove session_id from URL so it doesn’t trigger again
          url.searchParams.delete("session_id");
          window.history.replaceState({}, "", url.toString());
        }
      } catch (err) {
        console.error("Stripe verification failed:", err);
      } finally {
        setIsReloading(false);
      }
    }

    verifyAndReload();
  }, [result?.id]);

  /* -------------------------------------------------------------------------------------------------
   * HANDLE IDENTITY CHECKOUT ($4.99)
   * ------------------------------------------------------------------------------------------------*/
  async function handleIdentityCheckout() {
    try {
      setIdentityLoading(true);

      const res = await fetch("/api/checkout/identity-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renterName: result?.publicProfile?.name ?? fullName,
          renterEmail: result?.publicProfile?.email ?? email,
          renterPhone: result?.publicProfile?.phone ?? phone,
          searchSessionId: result?.id ?? null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to checkout");

      if (json.url) window.location.href = json.url;
    } catch (err: any) {
      alert(err.message || "Failed to checkout.");
    } finally {
      setIdentityLoading(false);
    }
  }

  /* -------------------------------------------------------------------------------------------------
   * ENTERPRISE FULL REPORT CHECKOUT ($20)
   * ------------------------------------------------------------------------------------------------*/
  async function handleFullReportCheckout() {
    try {
      if (!result?.preMatchedReportId) {
        alert("No report found to unlock.");
        return;
      }

      setFullReportCheckoutLoading(true);

      const res = await fetch("/api/checkout/full-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: result.preMatchedReportId,
          renterName: result.publicProfile?.name ?? fullName,
          renterEmail: result.publicProfile?.email ?? email,
          userId: user?.uid ?? null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Checkout failed.");

      if (json.alreadyUnlocked) {
        window.location.href = `/report/${result.preMatchedReportId}`;
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      } else {
        alert("Checkout session created, but no redirect URL returned.");
      }
    } catch (err: any) {
      alert(err.message || "Failed to unlock report.");
    } finally {
      setFullReportCheckoutLoading(false);
    }
  }

  /* -------------------------------------------------------------------------------------------------
   * DEFAULT SEARCH CALL
   * ------------------------------------------------------------------------------------------------*/
  async function defaultSearch(payload: SearchPayload): Promise<SearchResult> {
    const res = await fetch("/api/renters/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        userId: user?.uid || null,
      }),
    });

    const json = await res.json().catch(() => null);
    if (!json) throw new Error("Invalid server response.");

    if (!res.ok) throw new Error(json.error || "Search failed.");

    return json;
  }

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
      console.error(err);
      setError(err.message || "Search failed.");
    } finally {
      clearInterval(interval);
      setTimeout(() => setProgress(0), 350);
      setIsLoading(false);
    }
  }

  /* -------------------------------------------------------------------------------------------------
   * BACK BUTTON
   * ------------------------------------------------------------------------------------------------*/
  const goBack = () => {
    if (activeStep === 2) return setActiveStep(1);
    if (activeStep === 3) return setActiveStep(2);
    if (activeStep === "multi" || activeStep === "noMatch") return setActiveStep(1);
  };
  /* -------------------------------------------------------------------------------------------------
   *  STEP 1 — SEARCH FORM
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
            ref={firstFieldRef}
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

            {/* LOADING STATE */}
            {useAutofill && suggestionsLoading && (
              <p className="text-[11px] text-gray-400 mt-1">Searching…</p>
            )}
          </div>
        </div>

        {/* CITY + ZIP */}
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

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   *  MULTIPLE MATCHES FOUND
   * ------------------------------------------------------------------------------------------------*/
  function renderMultiMatch() {
    if (!result?.candidates?.length) return null;

    return (
      <div className="space-y-5 sm:space-y-6">
        {/* BACK */}
        <button
          onClick={goBack}
          className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-700" />
          <h2 className="font-semibold text-lg">Multiple Potential Matches</h2>
        </div>

        <p className="text-sm text-gray-600">
          Select the correct renter profile to continue.
        </p>

        {/* MATCH LIST */}
        <div className="space-y-3">
          {result.candidates
            .sort((a, b) => b.similarity - a.similarity)
            .map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => {
                  setResult({
                    ...result,
                    matchType: "single",
                    identityScore: candidate.similarity,
                    publicProfile: {
                      name: candidate.renter.fullName,
                      email: candidate.renter.email ?? undefined,
                      phone: candidate.renter.phone ?? undefined,
                      address: candidate.renter.address ?? undefined,
                      licenseNumber: candidate.renter.licenseNumber ?? undefined,
                    },
                  });
                  setActiveStep(2);
                }}
                className="w-full border rounded-lg p-4 text-left hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {candidate.renter.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {candidate.similarity}% match
                  </span>
                </div>

                {/* Contact Preview */}
                {candidate.renter.email && (
                  <p className="text-xs text-gray-500 mt-1">
                    ✉ {candidate.renter.email}
                  </p>
                )}
                {candidate.renter.phone && (
                  <p className="text-xs text-gray-500">
                    📞 {candidate.renter.phone}
                  </p>
                )}
              </button>
            ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   *  NO MATCH FOUND
   * ------------------------------------------------------------------------------------------------*/
  function renderNoMatch() {
    return (
      <div className="space-y-6">
        {/* BACK */}
        <button
          onClick={goBack}
          className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>

        <div className="flex items-center gap-3 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
          <h2 className="text-lg font-semibold">No Matching Renter Found</h2>
        </div>

        <p className="text-sm text-gray-600">
          The renter may simply be new to RentFAX.
        </p>

        {/* ACTION CARD */}
        <div className="rounded-xl border p-4 bg-white shadow-sm space-y-4">
          <p className="font-medium text-sm">Next Actions</p>

          {/* SELF-VERIFY */}
          <button
            onClick={() => {
              setVerifyName(fullName);
              setVerifyEmail(email);
              setVerifyPhone(phone);
              setOpenSelfVerify(true);
            }}
            className="w-full border rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
          >
            Request Self-Verification (Free)
          </button>

          {/* IDENTITY CHECK */}
          <button
            onClick={handleIdentityCheckout}
            className="w-full border rounded-lg border-gray-900 px-3 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white"
          >
            Identity Check ($4.99)
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------------------------------
   *  STEP 2 — MATCH FOUND
   * ------------------------------------------------------------------------------------------------*/
  function renderStep2() {
    if (!result) return null;

    const profile = result.publicProfile || {};
    const hasReport = !!result.preMatchedReportId;

    return (
      <div className="space-y-6">
        {/* BACK */}
        <button
          onClick={goBack}
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

          {/* SCORES */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-gray-500">Identity Score</p>
              <p className="font-semibold">
                {result.identityScore != null
                  ? `${result.identityScore}%`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] text-gray-500">Fraud Score</p>
              <p className="font-semibold">
                {result.fraudScore != null ? `${result.fraudScore}%` : "—"}
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

        {/* INFO SECTION */}
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

        {/* IDENTITY CHECK BUTTON */}
        <button
          onClick={handleIdentityCheckout}
          disabled={identityLoading}
          className="w-full border border-gray-900 rounded-full px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white disabled:opacity-50"
        >
          {identityLoading && (
            <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
          )}
          Identity Check ($4.99)
        </button>

        {/* SELF-VERIFY BUTTON */}
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
   *  STEP 3 — NEXT ACTIONS (FULL REPORT UNLOCK + VERIFICATION OPTIONS)
   * ------------------------------------------------------------------------------------------------*/
  function renderStep3() {
    if (!result) return null;

    const hasReport = !!result.preMatchedReportId;
    const isUnlocked = result.unlocked === true;

    // If Stripe redirect is refreshing report access
    if (isReloading) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          <p className="mt-3 text-sm text-gray-600">
            Verifying purchase and updating report…
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* BACK */}
        <button
          onClick={goBack}
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

          {/* NO REPORT EXISTS */}
          {!hasReport && (
            <p className="text-xs text-gray-600">
              No internal RentFAX reports exist yet.  
              You can verify the renter’s identity or send a self-verification request.
            </p>
          )}

          {/* REPORT EXISTS BUT NOT UNLOCKED */}
          {hasReport && !isUnlocked && (
            <p className="text-xs text-gray-600">
              This renter already has a RentFAX incident history.  
              Unlock the full report for complete details:  
              disputes, fraud indicators, payments, AI summary, and incident timeline.
            </p>
          )}

          {/* ALREADY UNLOCKED */}
          {hasReport && isUnlocked && (
            <p className="text-xs text-gray-600">
              Full report unlocked!  
              You now have access to the complete incident timeline and all risk data.
            </p>
          )}
        </div>

        {/* ACTIONS */}
        {!hasReport ? (
          <>
            {/* IDENTITY CHECK */}
            <button
              onClick={handleIdentityCheckout}
              disabled={identityLoading}
              className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white disabled:opacity-50"
            >
              {identityLoading && <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />}
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
              Includes incident timeline, disputes, fraud indicators, unpaid balances,  
              AI risk summary, rental history, and full profile data.
            </p>
          </>
        ) : (
          <>d
            {/* VIEW UNLOCKED REPORT */}
            <button
              onClick={() => router.push(`/report/${result.preMatchedReportId}`)}
              className="w-full rounded-full bg-green-600 text-white px-3 py-2 text-xs font-semibold hover:bg-green-700"
              >
              View Full Report
            </button>
          </>
        )}

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
   *  SELF-VERIFICATION MODAL (SEND VIA EMAIL OR SMS)
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
            className="relative w-full max-w-md rounded-xl bg-white p-5 sm:p-6 shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpenSelfVerify(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-900"
            >
              <X className="h-5 w-5" />
            </button>

            {/* HEADER */}
            <h3 className="text-base sm:text-lg font-semibold">Send Verification Request</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">
              A secure identity verification link will be sent to the renter via email or SMS.
            </p>

            {/* FULL NAME */}
            <div className="mb-3 sm:mb-4">
              <label className="text-xs sm:text-sm font-medium">Full Name</label>
              <input
                value={verifyName}
                onChange={(e) => setVerifyName(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3 sm:mb-4">
              <label className="text-xs sm:text-sm font-medium">Email</label>
              <input
                value={verifyEmail}
                onChange={(e) => setVerifyEmail(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* PHONE */}
            <div className="mb-4">
              <label className="text-xs sm:text-sm font-medium">Phone</label>
              <input
                value={verifyPhone}
                onChange={(e) => setVerifyPhone(formatPhone(e.target.value))}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            {/* SEND BUTTON */}
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
   *  MAIN RENDER — MODAL WRAPPER + HEADER + FOOTER
   * ------------------------------------------------------------------------------------------------*/
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[15000] bg-black/60 backdrop-blur-sm flex justify-end items-stretch"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* MAIN PANEL */}
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
            <div className="border-b px-4 sm:px-6 py-3 sm:py-4 relative">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <h2 className="text-lg sm:text-2xl font-semibold">Renter Search</h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    AI-powered identity & fraud screening
                  </p>
                </div>

                {/* CONFIDENCE BADGE */}
                <div
                  className={`rounded-full border px-2.5 sm:px-3 py-1 text-[11px] font-medium flex items-center`}
                >
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

              {/* CLOSE BUTTON */}
              <button
                onClick={onClose}
                className="absolute right-3 sm:right-4 top-3 sm:top-4 text-gray-500 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* BODY CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8">
              {activeStep === 1 && renderStep1()}
              {activeStep === "multi" && renderMultiMatch()}
              {activeStep === "noMatch" && renderNoMatch()}
              {activeStep === 2 && renderStep2()}
              {activeStep === 3 && renderStep3()}
            </div>

            {/* STEP 1 FOOTER CTA */}
            {activeStep === 1 && (
              <div className="border-t px-4 sm:px-6 py-3 sm:py-4 bg-white">
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

                <p className="text-center text-[11px] sm:text-xs text-gray-600 mt-2.5">
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
