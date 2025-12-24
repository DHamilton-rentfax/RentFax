
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth.tsx";
import OnboardingProgress from "@/components/OnboardingProgress";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to add your Stripe publishable key to your environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const plans = [
  { id: "price_1J...", name: "Basic", price: "$10/mo" },
  { id: "price_1J...", name: "Pro", price: "$50/mo" },
  { id: "price_1J...", name: "Enterprise", price: "Contact Us" },
];

export default function Step5Page() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!user || !selectedPlan) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/billing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: selectedPlan }),
      });

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await res.json();
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to proceed to checkout. Try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-center">
        <OnboardingProgress step={5} totalSteps={5} />
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-gray-300 mb-6">Select a plan that fits your needs.</p>

        <div className="space-y-4 text-left">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`p-4 rounded-xl border-2 ${selectedPlan === plan.id ? "border-blue-500" : "border-white/20"} cursor-pointer`}
            >
              <h3 className="font-bold text-lg">{plan.name}</h3>
              <p className="text-gray-400">{plan.price}</p>
            </div>
          ))}

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedPlan}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-50 mt-4"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Redirecting..." : "Continue to Checkout"}
          </button>
          <button type="button" onClick={() => router.push("/onboarding/complete")} className="w-full text-center mt-2 text-gray-400 hover:underline">
            Skip for now
          </button>
        </div>
      </div>
    </main>
  );
}
