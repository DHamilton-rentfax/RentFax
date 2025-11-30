"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertTriangle } from "lucide-react";

interface RenterCreateDisputeModalProps {
  incidentId: string;
  close: () => void;
}

export default function RenterCreateDisputeModal({
  incidentId,
  close,
}: RenterCreateDisputeModalProps) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please select or enter a reason for your dispute.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/renter/disputes/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidentId,
          reason: reason.trim(),
          details: details.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create dispute");
      }

      close();
    } catch (err: any) {
      console.error("Create dispute error", err);
      setError(err.message || "Could not create dispute.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Dispute This Incident</h2>
      </div>

      <p className="text-sm text-gray-600">
        Explain why you believe this incident is inaccurate or unfair. Our team
        and the reporting party will review your dispute and any supporting
        evidence you provide.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Dispute reason
        </label>
        <Input
          placeholder="Example: Paid in full / Not my account / Wrong dates"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">
          Additional details (optional)
        </label>
        <textarea
          rows={4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          placeholder="Share context, dates, receipts, or any other information that helps your case."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1"
          onClick={handleSubmit}
          disabled={submitting || !reason.trim()}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Submit Dispute"
          )}
        </Button>
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}