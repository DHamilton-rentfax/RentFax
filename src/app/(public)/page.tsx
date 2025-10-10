
'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import RenterSearchModal from "@/components/renter/RenterSearchModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          AI-powered verification for property, car, and equipment rentals. Protect your business with instant fraud detection and dispute automation.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
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
          <h2 className="text-3xl font-bold mb-12 text-[#1A2540]">Why Choose RentFAX</h2>
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
                <h3 className="text-xl font-semibold text-[#1A2540] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 cta-section text-center text-white">
        <h2 className="text-3xl font-bold mb-6">Choose the plan that fits your business</h2>
        <p className="mb-10 text-gray-300">
          Simple pricing designed for flexibility — pay as you go or unlock unlimited access.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <div className="bg-white text-[#1A2540] rounded-xl p-8 w-80 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Single Report</h3>
            <p className="text-4xl font-bold mb-4">$20</p>
            <p className="text-sm text-gray-600 mb-6">Perfect for individual screenings.</p>
            <button onClick={() => setIsModalOpen(true)} className="w-full py-2 cta-button">
              Start Now
            </button>
          </div>
          <div className="bg-accent text-[#1A2540] rounded-xl p-8 w-80 shadow-lg scale-105">
            <h3 className="text-xl font-semibold mb-2">Pro 50 Reports</h3>
            <p className="text-4xl font-bold mb-4">$149</p>
            <p className="text-sm text-[#1A2540]/80 mb-6">For growing property or rental businesses.</p>
            <Link href="/pricing" className="block w-full py-2 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#2a3660]">
              Get Pro
            </Link>
          </div>
          <div className="bg-white text-[#1A2540] rounded-xl p-8 w-80 shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Unlimited Access</h3>
            <p className="text-4xl font-bold mb-4">$299</p>
            <p className="text-sm text-gray-600 mb-6">For enterprise-grade screening operations.</p>
            <Link href="/pricing" className="block w-full py-2 cta-button">
               Get Unlimited
            </Link>
          </div>
        </div>
      </section>

      <RenterSearchModal open={isModalOpen} setOpen={setIsModalOpen} />
    </main>
  );
}
