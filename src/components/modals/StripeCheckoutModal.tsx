"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StripeCheckoutModal({ priceId, renterId, close }) {
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    setLoading(true);

    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, renterId }),
    });

    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <CreditCard className="h-5 w-5 text-blue-500" />
        Complete Purchase
      </h2>

      <p className="text-sm text-gray-600">
        You will be redirected to a secure Stripe checkout page.
      </p>

      <Button className="w-full" onClick={checkout} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Continue to Checkout"
        )}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
