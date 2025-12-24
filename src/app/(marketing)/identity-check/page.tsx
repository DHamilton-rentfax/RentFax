"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, ShieldCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IdentityCheckPage() {
  const params = useSearchParams();
  const router = useRouter();

  const renterId = params.get("renter");

  const [loading, setLoading] = useState(true);
  const [renter, setRenter] = useState<any>(null);
  const [error, setError] = useState("");

  // ==========================================
  // Fetch renter record
  // ==========================================
  useEffect(() => {
    if (!renterId) {
      setError("Missing renter ID.");
      setLoading(false);
      return;
    }

    const fetchRenter = async () => {
      try {
        const res = await fetch(`/api/renters/get?renterId=${renterId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to load renter.");

        setRenter(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRenter();
  }, [renterId]);

  // ==========================================
  // Start Stripe checkout
  // ==========================================
  const handlePurchase = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/billing/identity-check", {
        method: "POST",
        body: JSON.stringify({ renterId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start checkout.");

      window.location.href = data.url; // Redirect to Stripe
    } catch (e: any) {
      alert(e.message);
      setLoading(false);
    }
  };

  // ==========================================
  // Continue to actual verification page
  // ==========================================
  const handleContinue = () => {
    router.push(`/verify?id=${renterId}`);
  };

  // ==========================================
  // Loading skeleton
  // ==========================================
  if (loading)
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );

  // ==========================================
  // Error
  // ==========================================
  if (error)
    return (
      <div className="p-8 text-center text-red-500 font-medium">{error}</div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Identity Verification</h1>

      <div className="p-5 border rounded-xl bg-white shadow-sm space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck size={18} className="text-green-600" />
          Verify Renter
        </h2>

        <p className="text-sm text-muted-foreground">
          Identity verification confirms that this renter is a real person and
          prevents fraud or mistaken identity. This step is required to unlock
          the full RentFAX report.
        </p>

        <div className="mt-4 border-t pt-4 space-y-1 text-sm">
          <p>
            <strong>Name:</strong> {renter?.name || "—"}
          </p>
          <p>
            <strong>Email:</strong> {renter?.email || "—"}
          </p>
          <p>
            <strong>Phone:</strong> {renter?.phone || "—"}
          </p>
        </div>
      </div>

      {/* Price Box */}
      <div className="p-4 border rounded-xl bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Identity Check</span>
          <span className="text-xl font-bold">$4.99</span>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Your purchase helps ensure safe and accurate renter verification
          across the RentFAX network.
        </p>
      </div>

      {/* Buttons */}
      <Button
        className="w-full py-6 text-lg flex items-center justify-center gap-2"
        onClick={handlePurchase}
        disabled={loading}
      >
        <CreditCard size={18} />
        Pay & Verify Identity
      </Button>

      <Button
        variant="outline"
        className="w-full py-5"
        onClick={handleContinue}
      >
        Continue (Already Paid)
      </Button>

      {/* Legal Notice */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        By proceeding, you confirm you have permission to verify this renter's
        identity for housing-related purposes under the Fair Credit Reporting
        Act (FCRA).
      </p>
    </div>
  );
}
