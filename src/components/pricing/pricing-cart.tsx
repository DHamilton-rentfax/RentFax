"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: string;
  lookupKey: string;
  description: string;
}

interface Props {
  plans: Plan[];
}

export default function PricingCart({ plans }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (lookupKey: string) => {
    try {
      setLoading(lookupKey);
      toast.loading("Redirecting to checkout...");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookupKey }),
      });

      const data = await res.json();
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      toast.dismiss();
      setLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 max-w-lg mx-auto mt-8"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
        Choose a Plan
      </h3>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Select a membership tier below to proceed to secure Stripe checkout.
      </p>

      <div className="space-y-4">
        {plans.map((plan) => (
          <motion.div
            key={plan.lookupKey}
            whileHover={{ scale: 1.02 }}
            className="border border-gray-100 p-5 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
            onClick={() => handleCheckout(plan.lookupKey)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800">{plan.name}</h4>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>
              <span className="text-emerald-600 font-bold text-lg">{plan.price}</span>
            </div>
            <button
              disabled={loading === plan.lookupKey}
              className={`mt-3 w-full px-4 py-2 rounded-md text-white font-medium transition ${
                loading === plan.lookupKey
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading === plan.lookupKey ? "Redirecting..." : "Subscribe"}
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
