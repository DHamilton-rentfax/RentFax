"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function PricingCart({ selectedPlan, selectedAddOns, onCheckoutComplete }: any) {
  const [open, setOpen] = useState(false);
  const totalItems = (selectedPlan ? 1 : 0) + selectedAddOns.length;

  const handleCheckout = async () => {
    try {
      const cartItems: any[] = [];
      if (selectedPlan?.id)
        cartItems.push({ priceId: selectedPlan.id, quantity: 1 });
      selectedAddOns.forEach((a: any) =>
        cartItems.push({ priceId: a.priceId, quantity: 1 })
      );

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "customer@example.com", // TODO: Replace with actual user email
          items: cartItems,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        // Optionally call onCheckoutComplete if the redirect is successful
        if(onCheckoutComplete) {
            onCheckoutComplete();
        }
      } else {
        alert("Failed to start checkout.");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout error. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg z-50"
      >
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-40 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Your Cart</h2>
          {selectedPlan ? (
            <div className="mb-4 border-b pb-2">
              <div className="font-semibold">{selectedPlan.name}</div>
              <div className="text-sm text-muted-foreground">{selectedPlan.price}</div>
            </div>
          ) : (
            <p className="text-muted-foreground mb-4">No plan selected.</p>
          )}

          {selectedAddOns.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Add-Ons</h3>
              {selectedAddOns.map((a: any) => (
                <div key={a.priceId} className="text-sm mb-1">
                  • {a.name}
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={totalItems === 0}
            className="mt-6 w-full bg-primary text-white py-2 rounded hover:bg-primary/90 disabled:bg-muted"
          >
            Proceed to Checkout →
          </button>
        </div>
      )}
    </>
  );
}
