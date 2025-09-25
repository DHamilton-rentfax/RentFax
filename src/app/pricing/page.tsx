
"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    id: "risk_report",
    name: "Risk Report",
    priceMonthly: "$20 / report",
    priceAnnual: "$20 / report",
    description: "Pay-as-you-go renter risk checks.",
    features: ["Single renter check", "Basic fraud signals", "Email report delivery"],
    cta: "Buy Report",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: "$149 / mo",
    priceAnnual: "$1490 / yr",
    description: "Unlimited reports, AI assistant, and fraud detection.",
    features: [
      "Unlimited renter reports",
      "AI Risk Assistant",
      "Fraud detection alerts",
      "Dispute resolution portal",
      "Basic analytics dashboard",
      "Email + chat support",
    ],
    cta: "Get Started",
  },
  {
    id: "unlimited",
    name: "Unlimited",
    priceMonthly: "$299 / mo",
    priceAnnual: "$2990 / yr",
    description: "Enterprise-grade risk management with full analytics.",
    features: [
      "All Pro features",
      "Full analytics dashboard",
      "Compliance-ready reports",
      "Team seats included",
      "Priority support",
      "API access",
    ],
    cta: "Contact Sales",
  },
];

const addons = [
  {
    name: "AI Risk Optimization",
    price: "$49 / mo",
    description: "Advanced AI insights and portfolio risk modeling.",
  },
  {
    name: "Priority Support",
    price: "$99 / mo",
    description: "Faster response times with dedicated account manager.",
  },
  {
    name: "Extra Team Seats",
    price: "$10 / seat",
    description: "Add more users to your RentFAX organization.",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gray-50 py-20 text-center">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Choose a plan that fits your rental business. Start small or scale to
          enterprise — RentFAX grows with you.
        </p>

        {/* Toggle */}
        <div className="mt-8 inline-flex items-center gap-3 bg-white border rounded-lg shadow px-4 py-2">
          <span
            className={`cursor-pointer ${!annual ? "text-emerald-600 font-semibold" : "text-gray-500"}`}
            onClick={() => setAnnual(false)}
          >
            Monthly
          </span>
          <div className="w-12 h-6 bg-gray-200 rounded-full relative">
            <div
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-600 transition ${
                annual ? "translate-x-6" : ""
              }`}
            />
          </div>
          <span
            className={`cursor-pointer ${annual ? "text-emerald-600 font-semibold" : "text-gray-500"}`}
            onClick={() => setAnnual(true)}
          >
            Annual <span className="ml-1 text-green-600">(Save 20%)</span>
          </span>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-8 border rounded-2xl shadow-sm bg-white hover:shadow-md transition flex flex-col"
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-2 text-2xl font-bold">
              {annual ? plan.priceAnnual : plan.priceMonthly}
            </p>
            <p className="mt-2 text-gray-600">{plan.description}</p>
            <ul className="mt-6 space-y-2 text-gray-600 flex-grow">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> {f}
                </li>
              ))}
            </ul>
            <Link
              href={plan.id === "unlimited" ? "/contact" : "/checkout"}
              className="mt-6 inline-block px-6 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 text-center"
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* Comparison Table */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center">Compare Plans</h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-6 py-3 text-left">Feature</th>
                  {plans.map((p) => (
                    <th key={p.id} className="border px-6 py-3 text-center">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  "Renter Reports",
                  "AI Risk Assistant",
                  "Fraud Detection",
                  "Dispute Resolution",
                  "Analytics Dashboard",
                  "Compliance Reports",
                  "API Access",
                  "Support Level",
                ].map((feature, i) => (
                  <tr key={i}>
                    <td className="border px-6 py-3">{feature}</td>
                    {plans.map((p, idx) => (
                      <td key={idx} className="border px-6 py-3 text-center">
                        {p.features.some((f) => f.toLowerCase().includes(feature.toLowerCase()))
                          ? "✔"
                          : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold">Optional Add-Ons</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {addons.map((addon) => (
              <div
                key={addon.name}
                className="p-6 bg-gray-50 border rounded-xl shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{addon.name}</h3>
                <p className="mt-2 text-emerald-600 font-bold">{addon.price}</p>
                <p className="mt-3 text-gray-600">{addon.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold">Why Upgrade?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-emerald-100">
          Free risk reports give you a taste of RentFAX. But to truly protect
          your business from fraud and disputes, upgrading unlocks AI insights,
          full analytics, and compliance-grade reporting.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-white text-emerald-700 font-medium hover:bg-gray-100"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border border-white text-white hover:bg-emerald-700 hover:border-emerald-700"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </main>
  );
}
