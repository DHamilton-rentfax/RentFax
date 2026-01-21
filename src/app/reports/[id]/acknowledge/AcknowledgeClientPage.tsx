"use client";

import * as React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

type Props = {
  report: {
    id: string;
    status: string;
    orgName: string;
  };
};

type Choice = "YES" | "NO" | "FRAUD";

export default function AcknowledgeClientPage({ report }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState<Choice | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<Choice | null>(null);

  /* ------------------------------------------------------------------
   * SUBMIT HANDLER
   * ------------------------------------------------------------------ */
  async function submit(choice: Choice) {
    if (loading) return; // hard guard against double-submit

    setLoading(choice);
    setError(null);
    setConfirming(null);

    try {
      const res = await fetch(
        `/api/reports/${report.id}/acknowledge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            choice,
            channel: "email", // future: allow SMS toggle
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Unable to process request");
      }

      // Backend contract is authoritative
      if (data.status === "confirmed") {
        router.replace("/acknowledge/success");
        return;
      }

      if (data.status === "pending_confirmation") {
        router.replace(
          `/acknowledge/success?pending=${choice}`
        );
        return;
      }

      throw new Error("Unexpected response from server");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setLoading(null);
    }
  }

  /* ------------------------------------------------------------------
   * SAFETY CHECK
   * ------------------------------------------------------------------ */
  if (report.status !== "PENDING_RENTER_ACK") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border shadow-xl p-6 text-center">
          <h1 className="text-xl font-semibold">
            No Action Required
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            This rental acknowledgment has already been handled.
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Current status:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {report.status}
            </span>
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------
   * RENDER
   * ------------------------------------------------------------------ */
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-[#1A2540] text-white flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Confirm Rental Relationship
            </h1>
            <p className="text-sm text-gray-600">
              {report.orgName} indicated they are renting to you.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
          Please confirm whether this relationship is correct.
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {/* YES */}
          <button
            onClick={() => submit("YES")}
            disabled={!!loading}
            className="w-full rounded-xl py-3 bg-[#1A2540] hover:bg-[#2a3660] text-white flex items-center justify-center gap-2"
          >
            {loading === "YES" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            Yes, I am renting
          </button>

          {/* NO */}
          <button
            onClick={() => setConfirming("NO")}
            disabled={!!loading}
            className="w-full rounded-xl py-3 bg-white border hover:bg-gray-50 text-gray-900 flex items-center justify-center gap-2"
          >
            <XCircle size={18} />
            No, this is incorrect
          </button>

          {/* FRAUD */}
          <button
            onClick={() => setConfirming("FRAUD")}
            disabled={!!loading}
            className="w-full rounded-xl py-3 bg-white border border-red-200 hover:bg-red-50 text-red-700 flex items-center justify-center gap-2"
          >
            <ShieldAlert size={18} />
            This is fraud
          </button>
        </div>

        {/* ------------------------------------------------------------------
         * CONFIRMATION MODAL (DOUBLE-OPT SAFETY)
         * ------------------------------------------------------------------ */}
        {confirming && (
          <div className="fixed inset-0 z-[16000] bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
              <h2 className="text-lg font-semibold">
                {confirming === "NO"
                  ? "Confirm Selection"
                  : "Fraud Warning"}
              </h2>

              <p className="mt-2 text-sm text-gray-700">
                {confirming === "NO" ? (
                  <>
                    Selecting <strong>No</strong> means you are stating
                    you are not renting from{" "}
                    <strong>{report.orgName}</strong>.
                    <br />
                    <br />
                    To prevent mistakes, you will receive a confirmation
                    link by email. No changes occur unless confirmed.
                  </>
                ) : (
                  <>
                    Reporting <strong>Fraud</strong> means you believe
                    this request is unauthorized.
                    <br />
                    <br />
                    This is a serious action and must be confirmed
                    through a secure link.
                  </>
                )}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setConfirming(null)}
                  className="flex-1 rounded-xl py-2 border hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => submit(confirming)}
                  className={`flex-1 rounded-xl py-2 text-white ${
                    confirming === "NO"
                      ? "bg-[#1A2540] hover:bg-[#2a3660]"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" size={18} />
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                If this was a mistake, cancel now. No action will be taken.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
