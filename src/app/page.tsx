// src/app/page.tsx
"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-900 text-white">
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            The Credit Score for Renters
          </h1>
          <p className="mt-6 text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
            RentFAX delivers instant renter risk scores, AI-powered fraud
            detection, and compliance-ready reports — so you can protect your
            fleet, property, and revenue.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-white text-blue-700 font-semibold shadow hover:bg-gray-100 transition"
            >
              Start Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-xl border border-white/50 text-white font-semibold hover:bg-white/10 transition"
            >
              Book Enterprise Demo
            </Link>
          </div>
        </div>
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </section>

      {/* Trusted Logos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            Trusted by rental businesses nationwide
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-70">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold">The Problem</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Bad renters cost fleets and property owners millions each year.
              Fraud, unpaid fees, disputes, and damages drain profits and waste
              time. Traditional screening is slow, inconsistent, and reactive.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">The RentFAX Solution</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our platform provides instant AI-powered renter risk scoring, fraud
              detection signals, and compliance-ready reporting. Make smarter
              rental decisions in seconds, protect your business, and grow with
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Upload Renter",
                desc: "Enter renter details or upload via CSV/API.",
              },
              {
                title: "Instant Risk Score",
                desc: "Our AI engine flags fraud and delivers clear risk scoring.",
              },
              {
                title: "Decide Confidently",
                desc: "Approve, deny, or flag renters with a defensible audit trail.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-8 bg-white border rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-gray-600">
            Everything rental businesses need to manage risk — built in.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Fraud Detection",
                desc: "Catch duplicate IDs, shared addresses, and suspicious renters.",
              },
              {
                title: "AI Risk Assistant",
                desc: "Receive contextual recommendations from AI insights.",
              },
              {
                title: "Dispute Resolution Portal",
                desc: "Streamlined process for managing renter disputes.",
              },
              {
                title: "Compliance Reporting",
                desc: "Generate reports for insurers, regulators, and legal.",
              },
              {
                title: "Analytics Dashboard",
                desc: "Track renter trends and monitor portfolio risk exposure.",
              },
              {
                title: "Team Controls",
                desc: "Role-based access and enterprise-grade collaboration.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-8 bg-gray-50 border rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Banner */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white text-center">
        <h2 className="text-2xl font-bold">
          “Urban Rentals NYC reduced renter fraud by 40% using RentFAX.”
        </h2>
        <p className="mt-4 text-blue-200">
          Real results from rental businesses just like yours.
        </p>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Plans for Every Business</h2>
          <p className="mt-4 text-gray-600">
            Start free, or unlock unlimited reports with PRO & Enterprise.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Risk Report",
                price: "$20 / report",
                features: ["Pay-as-you-go", "Single renter check"],
              },
              {
                name: "Pro",
                price: "$149 / mo",
                features: [
                  "Unlimited reports",
                  "AI Risk Assistant",
                  "Fraud detection",
                ],
              },
              {
                name: "Unlimited",
                price: "$299 / mo",
                features: [
                  "All Pro features",
                  "Enterprise seats",
                  "Full analytics",
                ],
              },
            ].map((plan, idx) => (
              <div
                key={idx}
                className="p-8 border rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold">{plan.price}</p>
                <ul className="mt-6 space-y-2 text-gray-600">
                  {plan.features.map((f, i) => (
                    <li key={i}>✔ {f}</li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className="mt-6 inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
                >
                  View Pricing
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to protect your rentals?
        </h2>
        <p className="mt-4 text-gray-600">
          Join rental businesses nationwide using RentFAX to manage renter risk.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Contact Sales
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-white font-semibold">RentFAX</h3>
            <p className="mt-4 text-sm">
              The credit score for renters. Protect your fleet, property, and
              business with AI-powered risk scoring.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/careers">Careers</Link>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/pricing">Pricing</Link>
              </li>
              <li>
                <Link href="/docs">Documentation</Link>
              </li>
              <li>
                <Link href="/api">API</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/legal/terms">Terms</Link>
              </li>
              <li>
                <Link href="/legal/privacy">Privacy</Link>
              </li>
              <li>
                <Link href="/legal/security">Security</Link>
              </li>
              <li>
                <Link href="/status">Status</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RentFAX. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
