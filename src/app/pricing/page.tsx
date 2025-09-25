'use client';

import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals testing the platform.",
    features: ["1 rental report / month", "Basic fraud checks", "Email support"],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Starter",
    price: "$9.99/mo",
    description: "For small operators with growing needs.",
    features: [
      "50 rental reports / month",
      "AI fraud detection",
      "Basic dispute resolution",
      "Community support",
    ],
    cta: "Start Free Trial",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$29/mo",
    description: "Best for businesses scaling rentals.",
    features: [
      "Unlimited rental reports",
      "Full AI Risk Engine",
      "Custom dispute workflow",
      "Priority support",
    ],
    cta: "Upgrade Now",
    href: "/signup",
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    description: "For fleets and enterprises with custom needs.",
    features: [
      "Unlimited everything",
      "Dedicated account manager",
      "Custom integrations",
      "SLA + compliance support",
    ],
    cta: "Contact Us",
    href: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-gray-600">
            Choose a plan that scales with your rental business.
          </p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`p-8 rounded-2xl border ${plan.highlight ? "border-indigo-600 shadow-xl" : "border-gray-200 shadow-sm"} bg-white flex flex-col`}
            >
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <p className="mt-2 text-gray-600">{plan.description}</p>
              <p className="mt-6 text-3xl font-bold text-gray-900">{plan.price}</p>
              <ul className="mt-6 space-y-3 text-gray-600 flex-1">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={`mt-8 text-center px-4 py-3 rounded-xl font-medium ${plan.highlight ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
