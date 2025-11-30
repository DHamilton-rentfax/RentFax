"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";

interface RenterPayForReportModalProps {
  renterId: string;
  close: () => void;
}

export default function RenterPayForReportModal({
  renterId,
  close,
}: RenterPayForReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/renter/report/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renterId }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to start checkout");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL missing from response");
      }
    } catch (err: any) {
      console.error("Checkout error", err);
      setError(err.message || "Could not start checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Unlock Your Full Report</h2>
      </div>

      <p className="text-sm text-gray-600">
        See the full RentFAX report that landlords and agencies see, including
        incidents, dispute history, and reputation insights.
      </p>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="space-y-2">
        <Button
          className="w-full"
          onClick={startCheckout}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Pay & View Report"
          )}
        </Button>
        <Button variant="outline" className="w-full" onClick={close}>
          Not now
        </Button>
      </div>
    </div>
  );
}