"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ShieldCheck,
  AlertTriangle,
  BadgeCheck,
  Loader2,
  CreditCard,
  Coins,
  Ban,
} from "lucide-react";

type VerificationStatus = "unverified" | "pending" | "verified" | "failed";
type VerificationMethod = "instant" | "self" | "company_legacy";

export type GateRenter = {
  renterId: string;
  displayName: string;
  verification: {
    status: VerificationStatus;
    method?: VerificationMethod;
    verifiedAt?: string; // ISO or display
    confidenceScore?: number; // 0..1 or 0..100, whichever you use; just display safely
  };
};

export type GateOrg = {
  orgId: string;
  orgName: string;
  trustTier?: "unverified" | "verified" | "enterprise";
  creditsAvailable: number;
  abuseScore?: number; // higher = worse
  isRestricted?: boolean; // if you already compute this server-side
  dailyRemaining?: number; // optional
};

type CreateReportResponse =
  | {
      ok: true;
      reportId: string;
      mode: "credit" | "stripe";
      charged?: number; // cents
    }
  | {
      ok: false;
      code:
        | "RENTER_NOT_VERIFIED"
        | "NO_CREDITS"
        | "RATE_LIMITED"
        | "ORG_RESTRICTED"
        | "UNAUTHORIZED"
        | "UNKNOWN";
      message?: string;
    };

type Props = {
  open: boolean;
  renter: GateRenter | null;
  org: GateOrg | null;

  /**
   * Called when the user selects "Start Verification" from the gate.
   * Your parent should route/open the verification decision flow (instant vs self vs legacy).
   */
  onStartVerification: (renterId: string) => void;

  /**
   * Called when report creation succeeds.
   * Parent should route user to the report editor for this reportId.
   */
  onCreated: (payload: { reportId: string; mode: "credit" | "stripe" }) => void;

  /**
   * Close ONLY on explicit user action, or after success if parent chooses.
   */
  onClose: () => void;

  /**
   * Optional: if you want the modal to remain open after success and show a "Continuing..."
   * leave it false; if true, we call onClose right after onCreated.
   */
  closeOnSuccess?: boolean;

  /**
   * Optional: display price (defaults to $20).
   */
  writePriceUSD?: number;
};

function friendlyVerificationLabel(method?: VerificationMethod) {
  if (!method) return "Verified";
  if (method === "instant") return "Verified (Instant)";
  if (method === "self") return "Verified (Self)";
  if (method === "company_legacy") return "Verified (Company Legacy)";
  return "Verified";
}

function normalizeErrorCode(code?: string): CreateReportResponse["code"] {
  if (
    code === "RENTER_NOT_VERIFIED" ||
    code === "NO_CREDITS" ||
    code === "RATE_LIMITED" ||
    code === "ORG_RESTRICTED" ||
    code === "UNAUTHORIZED"
  ) {
    return code;
  }
  return "UNKNOWN";
}

export default function ReportCreationGateModal({
  open,
  renter,
  org,
  onStartVerification,
  onCreated,
  onClose,
  closeOnSuccess = true,
  writePriceUSD = 20,
}: Props) {
  const [loading, setLoading] = useState<null | "credit" | "stripe">(null);
  const [error, setError] = useState<string | null>(null);
  const [serverCode, setServerCode] = useState<CreateReportResponse["code"] | null>(
    null
  );

  // Reset ephemeral state when opened/closed or target renter changes
  useEffect(() => {
    if (!open) {
      setLoading(null);
      setError(null);
      setServerCode(null);
    }
  }, [open]);

  useEffect(() => {
    setLoading(null);
    setError(null);
    setServerCode(null);
  }, [renter?.renterId]);

  const gateState = useMemo(() => {
    if (!renter || !org) return "loading" as const;

    // Hard gate: renter must be verified
    if (renter.verification.status !== "verified") return "not_verified" as const;

    // Hard gate: org restricted (server-calculated or local)
    if (org.isRestricted) return "restricted" as const;

    // Soft gate: if dailyRemaining is provided and is 0, treat as restricted
    if (typeof org.dailyRemaining === "number" && org.dailyRemaining <= 0)
      return "rate_limited" as const;

    // Eligible variants
    if (org.creditsAvailable > 0) return "eligible_has_credit" as const;
    return "eligible_no_credit" as const;
  }, [renter, org]);

  const title = useMemo(() => {
    if (!renter) return "Create Report";
    if (gateState === "not_verified") return "Verification Required";
    if (gateState === "restricted" || gateState === "rate_limited")
      return "Report Creation Restricted";
    return "Create Verified Renter Report";
  }, [gateState, renter]);

  const subtitle = useMemo(() => {
    if (!renter || !org) return "Loading…";

    if (gateState === "not_verified") {
      return "This renter must be verified before any company can create a report.";
    }
    if (gateState === "restricted") {
      return "Your organization is temporarily restricted from creating reports. Contact support if you believe this is an error.";
    }
    if (gateState === "rate_limited") {
      return "You’ve reached your current report creation limit. Try again later or contact support.";
    }

    // Eligible
    const costLine =
      org.creditsAvailable > 0
        ? "Cost: 1 credit or $20"
        : `Cost: $${writePriceUSD.toFixed(2)} (no credits available)`;

    return `This report will be permanently attached to the renter’s ledger. ${costLine}.`;
  }, [gateState, org, renter, writePriceUSD]);

  async function createReport(mode: "credit" | "stripe") {
    if (!renter?.renterId) return;
    setLoading(mode);
    setError(null);
    setServerCode(null);

    try {
      const res = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANT: server enforces all rules; this is just the request.
        body: JSON.stringify({
          renterId: renter.renterId,
          paymentMethod: mode,
        }),
      });

      const data = (await res.json().catch(() => null)) as Partial<CreateReportResponse> | null;

      // Normalize
      if (!res.ok || !data || (data as any).ok === false) {
        const code = normalizeErrorCode((data as any)?.code);
        setServerCode(code);

        // Friendly UX messages
        if (code === "RENTER_NOT_VERIFIED") {
          setError("Verification is required before you can create a report.");
        } else if (code === "NO_CREDITS") {
          setError("No credits available. Choose $20 payment to continue.");
        } else if (code === "RATE_LIMITED") {
          setError("Report creation is temporarily rate-limited for your org.");
        } else if (code === "ORG_RESTRICTED") {
          setError("Your organization is restricted from creating reports right now.");
        } else if (code === "UNAUTHORIZED") {
          setError("You don’t have permission to create a report.");
        } else {
          setError((data as any)?.message || "Could not create the report. Please try again.");
        }

        setLoading(null);
        return;
      }

      // Success
      const okData = data as Extract<CreateReportResponse, { ok: true }>;
      onCreated({ reportId: okData.reportId, mode });

      setLoading(null);
      if (closeOnSuccess) onClose();
    } catch (e: any) {
      setLoading(null);
      setError(e?.message || "Network error. Please try again.");
      setServerCode("UNKNOWN");
    }
  }

  if (!open) return null;

  const showClose = loading === null; // don't allow close mid-flight (prevents weird states)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4">
      <AnimatePresence>
        <motion.div
          key="gate-modal"
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="border-b px-6 py-5">
            {showClose && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-xl bg-gray-100 p-2">
                {gateState === "not_verified" && <ShieldCheck className="h-5 w-5" />}
                {(gateState === "restricted" || gateState === "rate_limited") && (
                  <Ban className="h-5 w-5" />
                )}
                {(gateState === "eligible_has_credit" || gateState === "eligible_no_credit") && (
                  <BadgeCheck className="h-5 w-5" />
                )}
                {gateState === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
              </div>

              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Renter + Org summary */}
            <div className="rounded-xl border bg-gray-50 p-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    Renter: {renter?.displayName ?? "Loading…"}
                  </div>
                  <div className="text-xs text-gray-600">
                    Status:{" "}
                    {renter?.verification.status === "verified"
                      ? friendlyVerificationLabel(renter?.verification.method)
                      : renter?.verification.status ?? "…"}
                    {typeof renter?.verification.confidenceScore === "number" && (
                      <>
                        {" "}
                        • Confidence:{" "}
                        {renter.verification.confidenceScore > 1
                          ? Math.round(renter.verification.confidenceScore)
                          : Math.round(renter.verification.confidenceScore * 100)}
                        %
                      </>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  <span className="font-medium text-gray-800">{org?.orgName ?? "…"}</span>
                  {org ? (
                    <>
                      {" "}
                      • Credits:{" "}
                      <span className="font-semibold text-gray-900">
                        {org.creditsAvailable}
                      </span>
                      {typeof org.dailyRemaining === "number" && (
                        <>
                          {" "}
                          • Remaining today:{" "}
                          <span className="font-semibold text-gray-900">
                            {org.dailyRemaining}
                          </span>
                        </>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <div className="min-w-0">
                  <div className="font-medium">Action blocked</div>
                  <div className="text-red-700">{error}</div>
                  {serverCode && serverCode !== "UNKNOWN" && (
                    <div className="mt-1 text-xs text-red-700/80">Code: {serverCode}</div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex flex-col gap-3">
              {gateState === "not_verified" && renter?.renterId && (
                <button
                  onClick={() => onStartVerification(renter.renterId)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-900"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Start Verification
                </button>
              )}

              {(gateState === "restricted" || gateState === "rate_limited") && (
                <div className="rounded-xl border bg-white p-4 text-sm text-gray-700">
                  <div className="font-semibold">Why this happens</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">
                    <li>High dispute / abuse risk signals</li>
                    <li>Report creation limit reached</li>
                    <li>Trust tier review in progress</li>
                  </ul>
                  <div className="mt-3 text-xs text-gray-500">
                    Support can review your org’s status if needed.
                  </div>
                </div>
              )}

              {gateState === "eligible_has_credit" && (
                <>
                  <button
                    disabled={loading !== null}
                    onClick={() => createReport("credit")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                  >
                    {loading === "credit" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <Coins className="h-4 w-4" />
                        Use 1 Credit to Create Report
                      </>
                    )}
                  </button>

                  <button
                    disabled={loading !== null}
                    onClick={() => createReport("stripe")}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60"
                  >
                    {loading === "stripe" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay ${writePriceUSD.toFixed(2)} to Create Report
                      </>
                    )}
                  </button>
                </>
              )}

              {gateState === "eligible_no_credit" && (
                <button
                  disabled={loading !== null}
                  onClick={() => createReport("stripe")}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white hover:bg-gray-900 disabled:opacity-60"
                >
                  {loading === "stripe" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting…
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      Pay ${writePriceUSD.toFixed(2)} to Create Report
                    </>
                  )}
                </button>
              )}

              {/* Cancel */}
              {showClose && (
                <button
                  onClick={onClose}
                  className="inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Microcopy */}
            <div className="mt-5 text-xs text-gray-500">
              Creating a report writes to the renter’s ledger and is fully auditable. Abuse or
              repeated false reporting may restrict your organization.
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
