"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, BarChart3, Globe2, Sparkles, KeyRound } from "lucide-react";

export default function InvestorsPage() {
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* HERO */}
      <section className="relative text-center py-24 px-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
        >
          Invest in the Future of <span className="text-yellow-300">Rental Intelligence</span>
        </motion.h1>

        <p className="max-w-3xl mx-auto text-lg text-blue-100 mb-8">
          RentFAX is building the world’s first AI-driven risk and identity platform for housing,
          car rentals, and equipment lending — stopping fraud and predicting reliability before
          assets are handed over.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => handleRedirect('/investor-deck.pdf')}
            className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Download Investor Deck
          </button>
          <button
            onClick={() => handleRedirect('https://app.rentfax.io/contact?source=investors-call')}
            className="px-8 py-3 bg-yellow-400 text-black rounded-lg font-semibold shadow-md hover:bg-yellow-300 transition"
          >
            Book Investor Call
          </button>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: <Shield className="h-8 w-8 text-yellow-300 mx-auto mb-2" />, stat: "$6.8B+", label: "Annual Rental Fraud Losses (US)" },
            { icon: <BarChart3 className="h-8 w-8 text-yellow-300 mx-auto mb-2" />, stat: "3 Verticals", label: "Housing, Vehicles, Equipment" },
            { icon: <TrendingUp className="h-8 w-8 text-yellow-300 mx-auto mb-2" />, stat: "80%+", label: "Reduction in Screening Costs" },
          ].map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {item.icon}
              <h3 className="text-3xl font-extrabold text-white">{item.stat}</h3>
              <p className="text-blue-100">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          The Global Rental Market Has a Trust Problem
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg mb-12">
          From cars to homes to construction gear, rental fraud and identity deception are growing
          faster than ever. Owners lose billions annually to fake IDs, falsified income docs, and
          defaulted payments — all because the industry relies on outdated verification tools built
          for 2005, not 2025.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-10">
          {[
            {
              icon: <KeyRound className="h-10 w-10 text-blue-600 mx-auto mb-4" />,
              title: "Housing",
              desc: "43% of landlords report at least one fraudulent tenant application per year.",
            },
            {
              icon: <Globe2 className="h-10 w-10 text-blue-600 mx-auto mb-4" />,
              title: "Car Rentals",
              desc: "Theft, chargebacks, and fake IDs cost rental fleets over $1.2B yearly.",
            },
            {
              icon: <Sparkles className="h-10 w-10 text-blue-600 mx-auto mb-4" />,
              title: "Equipment",
              desc: "Heavy equipment rental scams spiked 36% last year, with millions in losses.",
            },
          ].map((item) => (
            <div key={item.title} className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition bg-white">
              <div className="text-lg font-semibold text-gray-900 mb-2">{item.title}</div>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOLUTION SECTION */}
      <section className="bg-slate-50 py-24 px-6 text-center border-t">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          RentFAX is the Trust Infrastructure for the Rental Economy
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          Using AI identity forensics, behavioral risk scoring, and real-time fraud detection,
          RentFAX delivers a universal “trust layer” for every asset-based transaction — cars,
          homes, or machinery. One system. One renter identity. Infinite security.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "AI Risk Engine",
              desc: "Proprietary algorithms detect anomalies in applications and documents with 97% accuracy.",
            },
            {
              title: "Unified Renter Identity",
              desc: "Each renter receives a verified RentFAX ID that follows them across industries and geographies.",
            },
            {
              title: "Predictive Analytics",
              desc: "Landlords, fleet owners, and lenders can forecast defaults and damages before contracts are signed.",
            },
          ].map((feature) => (
            <div key={feature.title} className="p-6 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY INVEST */}
      <section className="py-24 px-6 bg-white text-center border-t">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Why Invest in RentFAX
        </h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          RentFAX is more than a product — it’s a data moat. Every report trains our AI engine,
          making it smarter, faster, and more defensible over time. Investors aren’t backing an app;
          they’re backing the foundation of a new financial infrastructure for the $400B+ global
          rental market.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { stat: "400B+", label: "Global Rental Market TAM" },
            { stat: "97%", label: "AI Fraud Detection Accuracy" },
            { stat: "Scalable", label: "Cross-Industry SaaS Platform" },
          ].map((item) => (
            <div key={item.label} className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition bg-white">
              <p className="text-5xl font-bold text-blue-700 mb-2">{item.stat}</p>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white">
        <h2 className="text-4xl font-bold mb-4">
          Be Part of the Next Generation of Trust Infrastructure
        </h2>
        <p className="text-lg text-blue-100 mb-8">
          Join our investor network shaping the future of verified renting. Together, we’ll reduce
          fraud, unlock credit access, and protect asset owners globally.
        </p>
        <button
          onClick={() => handleRedirect('https://app.rentfax.io/contact?source=investors-deck')}
          className="px-8 py-4 bg-yellow-400 text-black rounded-lg font-semibold text-lg shadow-lg hover:bg-yellow-300 transition"
        >
          Request Investor Deck
        </button>
      </section>
    </main>
  );
}