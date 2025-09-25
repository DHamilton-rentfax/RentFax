
// src/app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold text-gray-900">
            The Credit Score for Renters
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            RentFAX gives rental businesses instant risk scores to protect fleets,
            properties, and revenue.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Start Free
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "1. Upload Renter",
                desc: "Enter renter details or upload via CSV.",
              },
              {
                title: "2. Instant Risk Report",
                desc: "AI & fraud checks generate a clear risk score.",
              },
              {
                title: "3. Confident Decision",
                desc: "Approve, deny, or flag renters with confidence.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-6 border rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {step.title}
                </h3>
                <p className="mt-4 text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Fraud Detection",
                desc: "Catch duplicate IDs, shared addresses, and suspicious renters.",
              },
              {
                title: "Automated Risk Scoring",
                desc: "Standardized renter ratings across your business.",
              },
              {
                title: "Dispute Resolution",
                desc: "Handle renter disputes with built-in workflow tools.",
              },
              {
                title: "AI Risk Assistant",
                desc: "Get contextual recommendations from AI insights.",
              },
              {
                title: "Compliance Reporting",
                desc: "Export reports for regulators, insurance, and legal.",
              },
              {
                title: "Team & Enterprise",
                desc: "Seat-based access controls and custom integrations.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Pricing</h2>
          <p className="mt-4 text-gray-600">
            Start free, upgrade as your business grows.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                features: ["3 reports / month", "Basic scoring"],
              },
              {
                name: "Pro",
                price: "$29 / mo",
                features: [
                  "Unlimited reports",
                  "AI Risk Assistant",
                  "Fraud detection",
                ],
              },
              {
                name: "Enterprise",
                price: "Contact Sales",
                features: [
                  "Custom limits",
                  "Team seats",
                  "Compliance tools",
                  "Dedicated support",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className="p-8 border rounded-2xl shadow-sm bg-gray-50 hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {plan.name}
                </h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {plan.price}
                </p>
                <ul className="mt-6 space-y-2 text-gray-600">
                  {plan.features.map((f, i) => (
                    <li key={i}>✔ {f}</li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className="mt-6 inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
