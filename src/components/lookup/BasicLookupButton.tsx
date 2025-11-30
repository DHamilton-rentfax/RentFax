'use client';
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function BasicLookupButton({ renterData }: { renterData: any }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await fetch("/api/checkout/basic-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ renterData }),
      });

      if (!response.ok) throw new Error("Failed to start checkout");

      const { url } = await response.json();
      window.location.href = url; // Redirect to Stripe checkout
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong starting the checkout session.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-[#C9A227] text-white font-medium py-3 rounded-lg hover:bg-[#b3911f] transition"
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" />
          Processing Lookup...
        </span>
      ) : (
        "Run Basic Lookup – $4.99"
      )}
    </button>
  );
}
