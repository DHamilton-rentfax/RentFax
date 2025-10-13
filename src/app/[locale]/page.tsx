"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog } from "@headlessui/react";
import Link from "next/link";
import { useModal } from "@/context/ModalContext";
import { loadStripe } from "@stripe/stripe-js";

// NOTE: Make sure to add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to your .env.local file
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

export default function HomePage() {
  const { isModalOpen, closeModal, openModal } = useModal();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    license: "",
    state: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          fullName: formData.fullName,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        console.error("Stripe Checkout Error:", error);
        alert("An error occurred. Please try again.");
        setIsSubmitting(false);
        return;
      }

      if (sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            console.error("Stripe Redirect Error:", error.message);
            alert(`Error redirecting to checkout: ${error.message}`);
          }
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <section className="pt-36 pb-24 text-center relative overflow-hidden hero-bg">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-[#1A2540]"
        >
          Screen Renters. Verify Drivers.{" "}
          <span className="text-[#D4A017]">Prevent Fraud.</span>
        </motion.h1>
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg">
          AI-powered verification for property, car, and equipment rentals.
          Protect your business with instant fraud detection and dispute
          automation.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={openModal}
            className="px-8 py-3 bg-[#1A2540] text-white font-semibold rounded-lg shadow hover:bg-[#2a3660] transition"
          >
            Start Screening
          </button>
          <Link
            href="/how-it-works"
            className="px-8 py-3 border border-[#1A2540] rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-[#1A2540]">
            Why Choose RentFAX
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Cross-Industry Verification",
                text: "Screen renters, drivers, or borrowers instantly with multi-source validation.",
              },
              {
                title: "AI Fraud Detection",
                text: "Detect duplicate applications, mismatched identities, and behavioral risk in seconds.",
              },
              {
                title: "Automated Dispute Resolution",
                text: "Allow renters to upload evidence and resolve issues with a clear audit trail.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-[#1A2540] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 cta-section text-center text-white">
        <h2 className="text-3xl font-bold mb-6">
          Choose the plan that fits your business
        </h2>
        <p className="mb-10 text-gray-300">
          Simple pricing designed for flexibility — pay as you go or unlock
          unlimited access.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="bg-white text-[#1A2540] rounded-xl p-8 w-80 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Single Report</h3>
            <p className="text-4xl font-bold mb-4">$20</p>
            <p className="text-sm text-gray-600 mb-6">
              Perfect for individual screenings.
            </p>
            <button onClick={openModal} className="w-full py-2 cta-button">
              Start Now
            </button>
          </div>
          <div className="bg-accent text-[#1A2540] rounded-xl p-8 w-80 shadow-lg scale-105">
            <h3 className="text-xl font-semibold mb-2">Pro 50 Reports</h3>
            <p className="text-4xl font-bold mb-4">$149</p>
            <p className="text-sm text-[#1A2540]/80 mb-6">
              For growing property or rental businesses.
            </p>
            <Link
              href="/pricing"
              className="block w-full py-2 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#2a3660]"
            >
              Get Pro
            </Link>
          </div>
          <div className="bg-white text-[#1A2540] rounded-xl p-8 w-80 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
            <p className="text-4xl font-bold mb-4">$299</p>
            <p className="text-sm text-gray-600 mb-6">
              For enterprise-grade screening operations.
            </p>
            <Link href="/pricing" className="block w-full py-2 cta-button">
              Get Unlimited
            </Link>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <Dialog
            open={isModalOpen}
            onClose={() => !isSubmitting && closeModal()}
            className="fixed inset-0 z-50 flex items-center justify-center modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full mx-4 modal-content"
            >
              <Dialog.Title className="text-2xl font-bold mb-4 text-[#1A2540]">
                Start Screening
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  name="fullName"
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="w-full"
                  disabled={isSubmitting}
                />
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="w-full"
                  disabled={isSubmitting}
                />
                <input
                  name="phone"
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full"
                  disabled={isSubmitting}
                />
                <div className="flex gap-2">
                  <input
                    name="license"
                    onChange={handleChange}
                    placeholder="License #"
                    className="w-2/3"
                    disabled={isSubmitting}
                  />
                  <select
                    name="state"
                    onChange={handleChange}
                    required
                    className="w-1/3"
                    disabled={isSubmitting}
                  >
                    <option value="">State</option>
                    {states.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <input
                  name="address"
                  onChange={handleChange}
                  placeholder="Address (optional)"
                  className="w-full"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#2a3660] transition disabled:bg-gray-400"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-[#D4A017] font-medium hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </motion.div>
          </Dialog>
        )}
      </AnimatePresence>
    </main>
  );
}
