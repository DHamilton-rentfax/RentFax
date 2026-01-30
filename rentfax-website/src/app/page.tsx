'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Users,
} from 'lucide-react';
import type { ReactNode } from 'react';

import WebsiteShell from '@/components/layout/WebsiteShell';
import TrustSection from "@/components/trust-section";
import CaseStudies from "@/components/case-studies";
import RenterTrust from "@/components/renter-trust";
import CredibilityStrip from "@/components/credibility-strip";

/* ---------------------------------------------------------------------
 TYPES
---------------------------------------------------------------------- */
type CardProps = {
  icon: ReactNode;
  title: string;
  desc: string;
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    posthog?: {
      capture: (event_name: string, properties?: any) => void;
    };
  }
}

/* ---------------------------------------------------------------------
 PAGE
---------------------------------------------------------------------- */
export default function HomePage() {
  const startScreening = (location: string) => {
    window.gtag?.("event", "start_screening_click", {
      source: "marketing_site",
      location,
    });

    window.posthog?.capture("start_screening_click", {
      source: "marketing_site",
      location,
    });

    window.location.href =
      "https://app.rentfax.io/search?source=website";
  };

  return (
    <WebsiteShell>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">

        {/* HERO */}
        <section className="pt-24 md:pt-32 pb-20 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-[#1A2540] leading-tight"
          >
            Verify Renters. Prevent Fraud.{' '}
            <span className="text-[#D4A017]">Rent with Confidence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-gray-600 text-base md:text-lg"
          >
            AI-powered identity verification, fraud detection, and risk intelligence
            for property, vehicle, and equipment rentals worldwide.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => startScreening('hero')}
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

        {/* FEATURES */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
            What RentFAX Protects You From
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12">
            <FeatureCard
              icon={<ShieldCheck className="w-10 h-10 text-[#D4A017]" />}
              title="Identity Mismatch"
              desc="Detect fake IDs, stolen identities, and inconsistent renter information."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10 text-[#D4A017]" />}
              title="Repeat Offenders"
              desc="Surface renter behavior, disputes, and incidents across the network."
            />
            <FeatureCard
              icon={<Search className="w-10 h-10 text-[#D4A017]" />}
              title="Hidden Fraud Patterns"
              desc="AI automatically flags suspicious signals humans often miss."
            />
          </div>
        </section>

        <TrustSection />
        <CaseStudies />
        <RenterTrust />
        <CredibilityStrip />

        {/* FINAL CTA */}
        <section className="py-20 px-6 bg-gray-100 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
            Start Screening with Confidence
          </h2>
          <p className="text-gray-600 mt-3 mb-8 text-lg">
            Protect your rentals with verified identity and fraud intelligence.
          </p>

          <button
            onClick={() => startScreening('final_cta')}
            className="px-8 py-3 bg-[#1A2540] text-white font-semibold rounded-lg shadow hover:bg-[#2a3660] transition"
          >
            Start Screening
          </button>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "RentFAX",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "120",
              },
            }),
          }}
        />
      </main>
    </WebsiteShell>
  );
}

/* ---------------------------------------------------------------------
 COMPONENTS
---------------------------------------------------------------------- */
function FeatureCard({ icon, title, desc }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white shadow-sm rounded-xl p-8 border"
    >
      {icon}
      <h3 className="font-semibold text-xl mt-4 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}
