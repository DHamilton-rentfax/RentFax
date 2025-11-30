"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useModal } from "@/contexts/ModalContext";
import {
  ShieldCheck,
  Search,
  Users,
  BadgeCheck,
  BarChart3,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const { openModal } = useModal();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">

      {/* ================================
          HERO SECTION
      =================================== */}
      <section className="pt-36 pb-24 text-center relative overflow-hidden hero-bg px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold text-[#1A2540]"
        >
          Screen Renters. Verify Drivers.{" "}
          <span className="text-[#D4A017]">Prevent Fraud.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg"
        >
          AI-powered identity, fraud, and risk verification for property, vehicle, and equipment rentals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex justify-center gap-4"
        >
          <button
            onClick={() => openModal("searchRenter")}
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
        </motion.div>
      </section>

      {/* ================================
          FEATURE CARDS
      =================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1A2540]">
          What RentFAX Helps You Do
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12">
          Verify identity, check incident history, and detect fraud — instantly.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-sm rounded-xl p-8 border border-gray-100"
          >
            <ShieldCheck className="w-10 h-10 text-[#D4A017] mb-4" />
            <h3 className="font-semibold text-xl mb-2">Identity Verification</h3>
            <p className="text-gray-600">
              Stop fake renters, stolen identities, and mismatched information before they cause losses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-sm rounded-xl p-8 border border-gray-100"
          >
            <Users className="w-10 h-10 text-[#D4A017] mb-4" />
            <h3 className="font-semibold text-xl mb-2">Reputation & Incidents</h3>
            <p className="text-gray-600">
              View rental behavior across cars, homes, equipment, Airbnbs, U-Hauls, tools, and more.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white shadow-sm rounded-xl p-8 border border-gray-100"
          >
            <Search className="w-10 h-10 text-[#D4A017] mb-4" />
            <h3 className="font-semibold text-xl mb-2">AI Fraud Detection</h3>
            <p className="text-gray-600">
              Automatically flags suspicious patterns and prevents repeat offenders.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================================
          UNIVERSAL RENTAL USE CASES
      =================================== */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#1A2540]">Built for Every Rental</h2>
          <p className="text-gray-600 mt-2 mb-10">
            From homes to cars to equipment — RentFAX protects your business.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-700 font-medium">
            <div className="p-4 bg-white rounded-lg shadow-sm">Landlords</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">Car Rentals</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">Equipment Rentals</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">Airbnb & Short-Term</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">RV & Boat Rentals</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">U-Haul & Trailer</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">Tools & Camera Gear</div>
            <div className="p-4 bg-white rounded-lg shadow-sm">Storage Units</div>
          </div>
        </div>
      </section>

      {/* ================================
          HOW IT WORKS
      =================================== */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1A2540]">
          How RentFAX Works
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-14">
          A simple 3-step process to protect your rentals.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-xl shadow-sm border"
          >
            <BadgeCheck className="h-10 w-10 text-[#D4A017]" />
            <h3 className="font-semibold text-xl mt-4">1. Enter Renter Details</h3>
            <p className="text-gray-600 mt-2">
              Provide name, phone, email, or address to run your search.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-xl shadow-sm border"
          >
            <Search className="h-10 w-10 text-[#D4A017]" />
            <h3 className="font-semibold text-xl mt-4">2. Instant Matching</h3>
            <p className="text-gray-600 mt-2">
              We search the RentFAX network for identity, incidents, and fraud signals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-xl shadow-sm border"
          >
            <BarChart3 className="h-10 w-10 text-[#D4A017]" />
            <h3 className="font-semibold text-xl mt-4">3. View Full Report</h3>
            <p className="text-gray-600 mt-2">
              Unlock ID verification ($4.99) or pull the full behavior report ($20).
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================================
          FRAUD STATS
      =================================== */}
      <section className="py-20 px-6 bg-[#1A2540] text-white text-center">
        <h2 className="text-3xl font-bold">Rental Fraud Is Exploding</h2>
        <p className="text-gray-300 mt-3 mb-12 max-w-2xl mx-auto">
          RentFAX reduces losses by helping you detect identity mismatch, repeat offenders, and high-risk behaviors.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          <div>
            <h3 className="text-4xl font-bold text-[#D4A017]">11.6M</h3>
            <p className="text-gray-300 mt-2">Rental fraud victims yearly</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-[#D4A017]">$6.8B</h3>
            <p className="text-gray-300 mt-2">Annual rental fraud losses</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-[#D4A017]">42%</h3>
            <p className="text-gray-300 mt-2">Identity mismatch reduction</p>
          </div>
        </div>
      </section>

      {/* ================================
          TESTIMONIALS
      =================================== */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-[#1A2540]">
          Trusted by Rental Businesses
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12">
          Companies rely on RentFAX to protect their rentals and reduce fraud.
        </p>

        <div className="grid md:grid-cols-2 gap-10">

          <div className="bg-white p-8 shadow-sm border rounded-xl">
            <p className="text-gray-700 italic">
              “RentFAX helped us catch fake identities and cut our no-return losses by 37%.”
            </p>
            <p className="mt-4 font-semibold">— PrimeFlex Equipment Rentals</p>
          </div>

          <div className="bg-white p-8 shadow-sm border rounded-xl">
            <p className="text-gray-700 italic">
              “We immediately flagged a repeat scammer using multiple phone numbers. Worth every penny.”
            </p>
            <p className="mt-4 font-semibold">— UrbanDrive Car Rentals</p>
          </div>

        </div>
      </section>

      {/* ================================
          FINAL CTA BANNER
      =================================== */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold text-[#1A2540]">Ready to Screen Your First Renter?</h2>
        <p className="text-gray-600 mt-2 mb-8">
          Protect your rentals with AI-driven identity and fraud analysis.
        </p>

        <button
          onClick={() => openModal("searchRenter")}
          className="px-10 py-4 bg-[#1A2540] text-white rounded-lg text-lg font-semibold hover:bg-[#2A3660] transition inline-flex items-center gap-2"
        >
          Start Screening
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </main>
  );
}
