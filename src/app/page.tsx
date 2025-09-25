"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HERO */}
      <section className="relative overflow-hidden pt-40 pb-32 text-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        {/* Gradient background accents */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-white to-pink-100"></div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
        >
          Smarter Risk, <span className="text-indigo-600">Safer Rentals</span>
        </motion.h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          RentFAX gives rental businesses real-time risk scoring, fraud detection, and renter dispute resolution — trusted by operators nationwide.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700"
          >
            Start Free Trial
          </Link>
          <Link
            href="/pricing"
            className="px-6 py-3 border border-gray-300 rounded-xl font-medium hover:border-gray-400"
          >
            View Pricing
          </Link>
        </div>

        {/* Product Screenshot */}
        <div className="mt-16 flex justify-center px-4">
          <div className="rounded-2xl shadow-xl overflow-hidden border border-gray-200 w-full max-w-5xl">
            <Image
              src="https://picsum.photos/seed/rentfax-dash/1200/675"
              alt="App dashboard demo"
              width={1200}
              height={675}
              className="w-full"
              data-ai-hint="dashboard analytics"
            />
          </div>
        </div>

        {/* Trust Logos */}
        <div className="mt-16 flex justify-center gap-12 opacity-70">
          <img src="/logos/stripe.svg" alt="Stripe" className="h-10" />
          <img src="/logos/plaid.svg" alt="Plaid" className="h-10" />
          <img src="/logos/firebase.svg" alt="Firebase" className="h-10" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Why Choose RentFAX?
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-12">
            {[
              {
                title: "AI-Powered Risk Scores",
                desc: "Instantly detect fraud, duplicate identities, and hidden risks with our AI engine.",
                icon: "🤖",
              },
              {
                title: "Seamless Dispute Resolution",
                desc: "Offer renters a transparent portal to manage and resolve disputes efficiently.",
                icon: "⚖️",
              },
              {
                title: "Enterprise-Ready Security",
                desc: "Bank-level encryption, SOC 2 alignment, and 24/7 monitoring built-in.",
                icon: "🔒",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="text-4xl">{f.icon}</div>
                <h3 className="mt-4 text-xl font-semibold text-indigo-600">
                  {f.title}
                </h3>
                <p className="mt-3 text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-12 text-left">
            {[
              {
                step: "1",
                title: "Upload Renter Info",
                desc: "Add renter details manually or via CSV integration.",
              },
              {
                step: "2",
                title: "Run Risk Analysis",
                desc: "Our AI engine generates instant risk scores and flags fraud signals.",
              },
              {
                step: "3",
                title: "Decide with Confidence",
                desc: "View reports, resolve disputes, and protect your fleet or properties.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                  {s.step}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                  {s.title}
                </h3>
                <p className="mt-3 text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">What Customers Say</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "RentFAX saved us thousands by catching fraudulent applications before they became losses.",
                author: "Maria Martinez, Urban Rentals NYC",
              },
              {
                quote:
                  "Our investors love the transparency RentFAX brings to our rental risk process.",
                author: "Joanne Sturge, Fleet Manager",
              },
              {
                quote:
                  "The AI-driven insights are a game changer — I wouldn’t run my rental business without it.",
                author: "Paul Sanderson, Property Rentals Co.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl border border-gray-200 shadow-sm bg-gray-50"
              >
                <p className="italic text-gray-700">“{t.quote}”</p>
                <p className="mt-4 text-sm font-medium text-gray-900">
                  {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-pink-600 text-center text-white">
        <h2 className="text-4xl font-extrabold">
          Ready to protect your rentals with AI?
        </h2>
        <p className="mt-4 text-lg opacity-90">
          Join the next generation of rental businesses powered by RentFAX.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium shadow hover:bg-gray-100"
          >
            Get Started Free
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 border border-white rounded-xl font-medium hover:bg-white hover:text-indigo-600"
          >
            Contact Sales
          </Link>
        </div>
      </section>
    </div>
  );
}
