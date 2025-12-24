"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Plan = {
  id: string;
  name: string;
  price: string;
  lookupKey: string;
};

type AddOn = {
  name: string;
  priceId: string;
  slug: string;
};

type Props = {
  plans: Plan[];
  selectedPlan: Plan | null;
  selectedAddOns: AddOn[];
  billing: "monthly" | "annual";
};

export default function PricingCart({
  plans,
  selectedPlan,
  selectedAddOns,
  billing,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!selectedPlan) {
      alert("Please select a plan first.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planLookupKey: selectedPlan.lookupKey,
          addOns: selectedAddOns.map(a => a.priceId),
          billing,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Your Selection</h3>

      {selectedPlan ? (
        <>
          <p className="font-medium">{selectedPlan.name}</p>
          <p className="text-sm text-muted-foreground">
            {selectedPlan.price} ({billing})
          </p>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          No plan selected yet.
        </p>
      )}

      <div className="mt-4">
        <p className="font-medium mb-1">Add-ons</p>
        {selectedAddOns.length ? (
          <ul className="list-disc ml-5 text-sm">
            {selectedAddOns.map(addon => (
              <li key={addon.priceId}>{addon.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No add-ons selected.
          </p>
        )}
      </div>

      <Button
        className="w-full mt-6"
        disabled={loading}
        onClick={handleCheckout}
      >
        {loading ? "Redirecting…" : "Proceed to Checkout"}
      </Button>
    </div>
  );
}
