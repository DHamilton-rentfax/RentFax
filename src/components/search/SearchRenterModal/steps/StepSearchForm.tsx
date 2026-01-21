"use client";

import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Wand2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { formatPhone } from "@/lib/formatPhone";

/* -------------------------------------------------------------------------------------------------
 * CONFIG
 * ------------------------------------------------------------------------------------------------*/
const BRAND_GOLD = "#D9A334";
const BRAND_NAVY = "#1A2540";
const AUTO_EXPAND_CONFIDENCE_THRESHOLD = 65;

/* -------------------------------------------------------------------------------------------------
 * TYPES
 * ------------------------------------------------------------------------------------------------*/
type Props = {
  memberId: string;
  setMemberId: (v: string) => void;

  fullName: string;
  setFullName: (v: string) => void;

  email?: string;
  setEmail?: (v: string) => void;

  phone?: string;
  setPhone?: (v: string) => void;

  address: string;
  setAddress: (v: string) => void;

  city: string;
  setCity: (v: string) => void;

  postalCode: string;
  setPostalCode: (v: string) => void;

  licenseNumber: string;
  setLicenseNumber: (v: string) => void;

  confidence?: number;
  requireLicense?: boolean;

  error?: string | null;
};

/* -------------------------------------------------------------------------------------------------
 * COMPONENT
 * ------------------------------------------------------------------------------------------------*/
export default function StepSearchForm({
  memberId,
  setMemberId,
  fullName,
  setFullName,

  email = "",
  setEmail = () => {},

  phone = "",
  setPhone = () => {},

  address,
  setAddress,

  city,
  setCity,

  postalCode,
  setPostalCode,

  licenseNumber,
  setLicenseNumber,

  confidence,
  requireLicense = false,
  error,
}: Props) {
  /* ---------------------------------- LOCAL AUTOFILL STATE ---------------------------------- */
  const [useAutofill, setUseAutofill] = useState(false);
  const [addrQuery, setAddrQuery] = useState("");

  /* ---------------------------------- ADVANCED UI ---------------------------------- */
  const [showAdvanced, setShowAdvanced] = useState(false);
  const autoExpandedRef = useRef(false);

  useEffect(() => {
    if (
      !autoExpandedRef.current &&
      typeof confidence === "number" &&
      confidence < AUTO_EXPAND_CONFIDENCE_THRESHOLD
    ) {
      setShowAdvanced(true);
      autoExpandedRef.current = true;
    }
  }, [confidence]);

  const input =
    "w-full rounded-xl bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 " +
    "shadow-[0_1px_0_rgba(0,0,0,0.06)] ring-1 ring-gray-200 focus:outline-none " +
    "focus:ring-2 focus:ring-[rgba(217,163,52,0.35)] transition";

  return (
    <div className="space-y-7">
      {/* TRUST STRIP */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-gray-500">
        <span className="inline-flex items-center gap-2">
          <Lock className="h-4 w-4" /> Encrypted
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Access logged
        </span>
        <span className="hidden sm:inline">Consent-first verification</span>
      </div>
      
      <input
        value={memberId}
        onChange={(e) => setMemberId(e.target.value.toUpperCase())}
        placeholder="Member ID (optional)"
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

      <p className="text-xs text-gray-500 mt-1">
        Fastest lookup if the renter has a RentFAX Member ID
      </p>

      {/* FULL NAME */}
      <Field label="Full legal name" hint="+25%" icon={User} accent={!!fullName}>
        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          className={input}
        />
      </Field>

      {/* EMAIL + PHONE */}
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Email address" hint="+15%" icon={Mail} accent={!!email}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className={input}
          />
        </Field>

        <Field label="Phone number" hint="+15%" icon={Phone} accent={!!phone}>
          <input
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(555) 555-5555"
            className={input}
          />
        </Field>
      </div>

      {/* ADDRESS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div>
              <div className="text-xs font-semibold" style={{ color: BRAND_NAVY }}>
                Primary address
              </div>
              <div className="text-[11px] text-gray-500">+20% match strength</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setUseAutofill((v) => !v)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium transition ring-1",
              useAutofill
                ? "bg-[rgba(217,163,52,0.12)] ring-[rgba(217,163,52,0.35)]"
                : "bg-white ring-gray-200"
            )}
          >
            <Wand2 className="h-4 w-4" style={{ color: useAutofill ? BRAND_GOLD : undefined }} />
            Autofill
            <span className={clsx("h-2 w-2 rounded-full", useAutofill ? "bg-green-500" : "bg-gray-300")} />
          </button>
        </div>

        <input
          value={useAutofill ? addrQuery : address}
          onChange={(e) =>
            useAutofill ? setAddrQuery(e.target.value) : setAddress(e.target.value)
          }
          placeholder="123 Main St"
          className={input}
        />
      </div>

      {/* LICENSE */}
      <Field
        label="Driver license / government ID"
        hint={requireLicense ? "Required" : "+20%"}
        icon={ShieldCheck}
        accent={!!licenseNumber || requireLicense}
      >
        <input
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
          placeholder="License or ID number"
          className={clsx(input, "uppercase")}
        />

        {requireLicense && !licenseNumber && (
          <div className="mt-2 flex items-start gap-2 text-xs text-amber-700">
            <AlertTriangle className="h-4 w-4 mt-0.5" />
            License is required due to identity or fraud risk signals.
          </div>
        )}
      </Field>

      {/* ADVANCED */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900"
      >
        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        {showAdvanced ? "Hide additional details" : "Add more details (optional)"}
      </button>

      {showAdvanced && (
        <div className="space-y-6 pt-2">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="City">
              <input value={city} onChange={(e) => setCity(e.target.value)} className={input} />
            </Field>

            <Field label="Postal code">
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={input}
              />
            </Field>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * FIELD
 * ------------------------------------------------------------------------------------------------*/
function Field({
  label,
  hint,
  icon: Icon,
  children,
  accent,
}: {
  label: string;
  hint?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-gray-500" />}
          <span className="text-xs font-semibold" style={{ color: BRAND_NAVY }}>
            {label}
          </span>
        </div>
        {hint && (
          <span className={clsx("text-[11px] font-medium", accent ? "text-gray-800" : "text-gray-500")}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
