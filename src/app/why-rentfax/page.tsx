"use client";

import { ShieldCheck, TrendingDown, Scale, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function WhyRentFAXPage() {
  const problems = [
    {
      icon: ShieldCheck,
      title: "Fraudulent Renters",
      desc: "Duplicate IDs, fake applications, and identity fraud cost the rental industry billions every year.",
    },
    {
      icon: TrendingDown,
      title: "Revenue Loss",
      desc: "Chargebacks, unpaid fees, and downtime from damaged vehicles or properties erode profitability.",
    },
    {
      icon: Scale,
      title: "Disputes & Legal Risk",
      desc: "Without standardized reports, businesses face lengthy disputes, lawsuits, and regulatory issues.",
    },
    {
      icon: BarChart3,
      title: "Lack of Data & Analytics",
      desc: "Rental companies operate blind, with no industry-standard risk score for renters.",
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gray-900 text-white py-28 text-center">
        <h1 className="text-5xl font-bold">Why RentFAX?</h1>
        <p className="mt-6 max-w-3xl mx-auto text-gray-300 text-lg">
          The rental industry loses billions each year to fraud, disputes, and
          unpaid fees. RentFAX exists to solve this — by creating the first
          standardized, AI-powered renter risk scoring system.
        </p>
      </section>

      {/* The Problem */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center">The Problems We Solve</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-50 border rounded-xl shadow hover:shadow-md transition text-center"
            >
              <item.icon className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Solution */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold">The RentFAX Solution</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Just like credit scores transformed lending, RentFAX is
              revolutionizing rentals. Our platform delivers instant renter risk
              scores, fraud detection, dispute resolution, and compliance-ready
              reporting — all in one place.
            </p>
            <ul className="mt-6 space-y-2 text-gray-700">
              <li>✔ Instant risk scoring</li>
              <li>✔ Fraud & identity verification</li>
              <li>✔ Dispute resolution portal</li>
              <li>✔ Analytics & compliance reports</li>
            </ul>
          </div>
          <div className="h-64 bg-gray-200 rounded-xl shadow-inner flex items-center justify-center text-gray-400">
            [ Solution Graphic ]
          </div>
        </div>
      </section>

      {/* Impact / Proof */}
      <section className="py-24 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">The Impact of RentFAX</h2>
        <p className="mt-4 text-gray-600">
          Businesses using RentFAX reduce fraud losses and disputes while
          approving more good renters.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="p-6 bg-white border rounded-xl shadow">
            <h3 className="text-3xl font-bold text-emerald-600">40%</h3>
            <p className="mt-2 text-gray-600">Reduction in renter fraud</p>
          </div>
          <div className="p-6 bg-white border rounded-xl shadow">
            <h3 className="text-3xl font-bold text-emerald-600">25%</h3>
            <p className="mt-2 text-gray-600">Faster approvals</p>
          </div>
          <div className="p-6 bg-white border rounded-xl shadow">
            <h3 className="text-3xl font-bold text-emerald-600">100%</h3>
            <p className="mt-2 text-gray-600">Compliance-ready audit trail</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold">Be Part of the Future of Rentals</h2>
        <p className="mt-4 text-emerald-100">
          Protect your business, reduce fraud, and create a safer rental
          ecosystem with RentFAX.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-white text-emerald-700 font-medium hover:bg-gray-100"
          >
            Start Free
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
