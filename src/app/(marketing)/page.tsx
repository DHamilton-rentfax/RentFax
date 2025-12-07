'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useModal } from '@/contexts/ModalContext';
import StartScreeningButton from '@/components/StartScreeningButton';
import {
  ShieldCheck,
  Search,
  Users,
  BadgeCheck,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const { openModal } = useModal();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">

      {/* ================================
          HERO SECTION (Mobile Optimized)
      =================================== */}
      <section className="pt-20 md:pt-32 pb-20 text-center relative overflow-hidden hero-bg px-6">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-[#1A2540] leading-tight md:leading-[1.15]"
        >
          Screen Renters. Verify Drivers.{" "}
          <span className="text-[#D4A017]">Prevent Fraud.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 md:mt-6 max-w-2xl mx-auto text-gray-600 text-base md:text-lg"
        >
          AI-powered identity, fraud, and risk verification for property, vehicle, and equipment rentals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 md:mt-10 flex flex-col sm:flex-row justify-center gap-4"
        >
          <StartScreeningButton className="w-full md:w-auto" />

          <Link
            href="/how-it-works"
            className="px-8 py-3 border border-[#1A2540] rounded-lg font-semibold hover:bg-gray-50 transition text-lg"
          >
            Learn More
          </Link>
        </motion.div>
      </section>

      {/* ================================
          FEATURE CARDS
      =================================== */}
      <section className="py-16 md:py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
          What RentFAX Helps You Do
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-10 md:mb-12 text-base md:text-lg">
          Verify identity, check incident history, and detect fraud — instantly.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ShieldCheck className="w-10 h-10 text-[#D4A017]" />}
            title="Identity Verification"
            desc="Stop fake renters, stolen identities, and mismatched information before they cause losses."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-[#D4A017]" />}
            title="Reputation & Incidents"
            desc="View rental behavior across cars, homes, equipment, Airbnbs, U-Hauls, tools, and more."
          />
          <FeatureCard
            icon={<Search className="w-10 h-10 text-[#D4A017]" />}
            title="AI Fraud Detection"
            desc="Automatically flags suspicious patterns and prevents repeat offenders."
          />
        </div>
      </section>

      {/* ================================
          USE CASE GRID
      =================================== */}
      <section className="py-16 md:py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">Built for Every Rental</h2>
          <p className="text-gray-600 mt-2 mb-8 md:mb-10 text-base md:text-lg">
            From homes to cars to equipment — RentFAX protects your business.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 text-gray-700 font-medium">
            {[
              "Landlords", "Car Rentals", "Equipment Rentals", "Airbnb & Short-Term",
              "RV & Boat Rentals", "U-Haul & Trailer", "Tools & Camera Gear", "Storage Units",
            ].map((item) => (
              <div key={item} className="p-3 md:p-4 bg-white rounded-lg shadow-sm text-sm md:text-base">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================
          HOW IT WORKS
      =================================== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
          How RentFAX Works
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12 text-base md:text-lg">
          A simple 3-step process to protect your rentals.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <StepCard
            icon={<BadgeCheck className="h-10 w-10 text-[#D4A017]" />}
            title="1. Enter Renter Details"
            desc="Provide name, phone, email, or address to run your search."
          />
          <StepCard
            icon={<Search className="h-10 w-10 text-[#D4A017]" />}
            title="2. Instant Matching"
            desc="We search the RentFAX network for identity, incidents, and fraud signals."
          />
          <StepCard
            icon={<BarChart3 className="h-10 w-10 text-[#D4A017]" />}
            title="3. View Full Report"
            desc="Unlock ID verification ($4.99) or pull the full behavior report ($20)."
          />
        </div>
      </section>

      {/* ================================
          FRAUD STATS
      =================================== */}
      <section className="py-16 md:py-20 px-6 bg-[#1A2540] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Rental Fraud Is Exploding</h2>
        <p className="text-gray-300 mt-2 md:mt-3 mb-10 md:mb-12 max-w-2xl mx-auto text-base md:text-lg">
          RentFAX reduces losses by helping you detect identity mismatch, repeat offenders, and high-risk behaviors.
        </p>

        <div className="grid sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {[
            { number: "11.6M", label: "Rental fraud victims yearly" },
            { number: "$6.8B", label: "Annual rental fraud losses" },
            { number: "42%", label: "Identity mismatch reduction" },
          ].map((stat) => (
            <div key={stat.number}>
              <h3 className="text-4xl md:text-5xl font-bold text-[#D4A017]">{stat.number}</h3>
              <p className="text-gray-300 mt-2 text-base md:text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================================
          TESTIMONIALS
      =================================== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
          Trusted by Rental Businesses
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-10 text-base md:text-lg">
          Companies rely on RentFAX to protect their rentals and reduce fraud.
        </p>

        <div className="grid md:grid-cols-2 gap-10">
          <Testimonial
            quote="RentFAX helped us catch fake identities and cut our no-return losses by 37%."
            author="PrimeFlex Equipment Rentals"
          />
          <Testimonial
            quote="We immediately flagged a repeat scammer using multiple phone numbers. Worth every penny."
            author="UrbanDrive Car Rentals"
          />
        </div>
      </section>

      {/* ================================
          CTA
      =================================== */}
      <section className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
          Ready to Screen Your First Renter?
        </h2>
        <p className="text-gray-600 mt-2 mb-8 text-base md:text-lg">
          Protect your rentals with AI-driven identity and fraud analysis.
        </p>

        <StartScreeningButton className="w-full md:w-auto" />
      </section>
    </main>
  );
}

/* ======================================================================
   SMALL COMPONENTS (Keeps main file clean)
====================================================================== */

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white shadow-sm rounded-xl p-6 md:p-8 border border-gray-100"
    >
      {icon}
      <h3 className="font-semibold text-lg md:text-xl mt-4 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm md:text-base">{desc}</p>
    </motion.div>
  );
}

function StepCard({ icon, title, desc }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 md:p-8 bg-white rounded-xl shadow-sm border"
    >
      {icon}
      <h3 className="font-semibold text-xl mt-4">{title}</h3>
      <p className="text-gray-600 mt-2 text-sm md:text-base">{desc}</p>
    </motion.div>
  );
}

function Testimonial({ quote, author }) {
  return (
    <div className="bg-white p-6 md:p-8 shadow-sm border rounded-xl text-left">
      <p className="text-gray-700 italic text-base md:text-lg">“{quote}”</p>
      <p className="mt-4 font-semibold text-[#1A2540]">{author}</p>
    </div>
  );
}
