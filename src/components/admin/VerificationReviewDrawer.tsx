"use client";

import { useEffect, useState } from "react";
import {
  X,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type VerificationStatus = "pending" | "basic" | "full" | "rejected";

type VerificationDetail = {
  id: string;
  renter: {
    fullName: string;
    email?: string;
    phone?: string;
  };
  status: VerificationStatus;
  createdAt: number;
  riskScore?: number;
  hasSelfie: boolean;
  hasID: boolean;
  selfieUrl?: string | null;
  idFrontUrl?: string | null;
  idBackUrl?: string | null;
};

interface VerificationReviewDrawerProps {
  open: boolean;
  onClose: () => void;
  verificationId: string | null;
}

export function VerificationReviewDrawer({
  open,
  onClose,
  verificationId,
}: VerificationReviewDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [record, setRecord] = useState<VerificationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open || !verificationId) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/admin/verify/get?id=${encodeURIComponent(verificationId)}`
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load verification.");
        setRecord(json.record);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load verification.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [open, verificationId]);

  if (!open) return null;

  async function decide(decision: "approve-basic" | "approve-full" | "reject") {
    if (!record) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/verify/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          decision,
          note: note || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Decision failed.");
      setRecord(json.record || record);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save decision.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
      <div
        className="h-full w-full max-w-lg bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="border-b px-4 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Review Verification</h2>
            {record && (
              <p className="text-xs text-gray-500">
                {record.renter.fullName} •{" "}
                {record.renter.email || record.renter.phone || "No contact"}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm">
          {loading && (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading…
            </div>
          )}

          {!loading && !record && (
            <p className="text-center text-gray-500 py-10">
              Verification not found.
            </p>
          )}

          {!loading && record && (
            <>
              {/* Quick flags */}
              <div className="border rounded-lg p-3 bg-gray-50 flex flex-col gap-1">
                {typeof record.riskScore === "number" && (
                  <p className="text-xs">
                    Risk Score:{" "}
                    <span
                      className={
                        record.riskScore >= 70
                          ? "text-red-600"
                          : record.riskScore >= 40
                          ? "text-orange-500"
                          : "text-green-600"
                      }
                    >
                      {record.riskScore} / 100
                    </span>
                  </p>
                )}
                <div className="flex flex-wrap gap-3 text-xs mt-1">
                  {record.hasSelfie ? (
                    <span className="text-green-700 flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Selfie
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      No Selfie
                    </span>
                  )}
                  {record.hasID ? (
                    <span className="text-green-700 flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      ID
                    </span>
                  ) : (
                    <span className="text-orange-600 flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      No ID
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-1">
                  Submitted: {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Images (small) */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">Selfie</p>
                  {record.selfieUrl ? (
                    <img
                      src={record.selfieUrl}
                      alt="Selfie"
                      className="w-full rounded-md object-cover max-h-32"
                    />
                  ) : (
                    <p className="text-[11px] text-gray-400">None</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">ID Front</p>
                  {record.idFrontUrl ? (
                    <img
                      src={record.idFrontUrl}
                      alt="ID Front"
                      className="w-full rounded-md object-cover max-h-32"
                    />
                  ) : (
                    <p className="text-[11px] text-gray-400">None</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 mb-1">ID Back</p>
                  {record.idBackUrl ? (
                    <img
                      src={record.idBackUrl}
                      alt="ID Back"
                      className="w-full rounded-md object-cover max-h-32"
                    />
                  ) : (
                    <p className="text-[11px] text-gray-400">None</p>
                  )}
                </div>
              </div>

              {/* Note */}
              {error && (
                <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}

              <div>
                <label className="text-[11px] text-gray-600 mb-1 block">
                  Internal Note (optional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full border rounded-md px-2 py-1 text-sm"
                  placeholder="Reason for decision, flags, etc."
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="border-t px-4 py-3 flex flex-wrap gap-2 justify-end bg-white">
          <button
            onClick={() => decide("approve-basic")}
            disabled={saving || !record}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-60"
          >
            <CheckCircle2 className="h-3 w-3" />
            Basic Verified
          </button>
          <button
            onClick={() => decide("approve-full")}
            disabled={saving || !record}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium border-green-600 text-green-600 hover:bg-green-50 disabled:opacity-60"
          >
            <ShieldCheck className="h-3 w-3" />
            Full Verified
          </button>
          <button
            onClick={() => decide("reject")}
            disabled={saving || !record}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium border-red-600 text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            <XCircle className="h-3 w-3" />
            Reject
          </button>
        </div>
      </div>

      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
