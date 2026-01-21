"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ShieldCheck, X } from "lucide-react";

type IdentityRequest = {
  token: string;
  renterName: string;
  renterEmail?: string | null;
  renterPhone?: string | null;
  status: "PENDING" | "COMPLETED" | "EXPIRED" | "CANCELLED";
};

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams?.get("id") ?? null;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [request, setRequest] = useState<IdentityRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmedName, setConfirmedName] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing verification link.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(
          `/api/identity/request?id=${encodeURIComponent(token)}`
        );
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to load request");
        }

        setRequest(json.request);
        setConfirmedName(json.request?.renterName ?? "");
      } catch (err: any) {
        setError(err.message || "Error loading verification.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setSubmitting(true);

      const res = await fetch("/api/identity/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          confirmedName,
          extraNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to complete verification");
      }

      setRequest((prev) =>
        prev ? { ...prev, status: "COMPLETED" } : prev
      );
    } catch (err: any) {
      setError(err.message || "Error completing verification.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------- UI ---------------------------------- */

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
          <p className="text-sm text-slate-600">
            Loading your verification…
          </p>
        </div>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full text-center">
          <X className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <h1 className="text-lg font-semibold mb-2">Link Problem</h1>
          <p className="text-sm text-slate-600">
            {error || "This verification link is invalid or expired."}
          </p>
        </div>
      </main>
    );
  }

  const isCompleted = request.status === "COMPLETED";

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 max-w-lg w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Verify Your Identity</h1>
            <p className="text-xs text-slate-500">
              This helps protect renters and rental companies by keeping records accurate.
            </p>
          </div>
        </div>

        <div className="mb-4 text-xs sm:text-sm text-slate-600">
          <p className="mb-1">
            Linked name:{" "}
            <span className="font-semibold">{request.renterName}</span>
          </p>
          {request.renterEmail && (
            <p>
              Email on file:{" "}
              <span className="font-mono text-[11px]">
                {request.renterEmail}
              </span>
            </p>
          )}
          {request.renterPhone && (
            <p>
              Phone on file:{" "}
              <span className="font-mono text-[11px]">
                {request.renterPhone}
              </span>
            </p>
          )}
        </div>

        {isCompleted ? (
          <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
            Thank you. Your verification has already been completed.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Confirm your full legal name
              </label>
              <input
                value={confirmedName}
                onChange={(e) => setConfirmedName(e.target.value)}
                required
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Anything we should know? (optional)
              </label>
              <textarea
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                rows={3}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-slate-900 text-white py-2.5 text-sm font-semibold hover:bg-black disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Submitting…" : "Confirm & Submit"}
            </button>

            <p className="text-[10px] text-slate-500 text-center">
              By submitting, you confirm the information is accurate.
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
