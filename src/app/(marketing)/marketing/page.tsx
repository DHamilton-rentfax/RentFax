'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useModal } from '@/contexts/ModalContext';
import {
  ShieldCheck,
  Search,
  Users,
  BadgeCheck,
  BarChart3,
} from 'lucide-react';
import type { ReactNode } from 'react';
import BlogGrid from '@/components/blog/BlogGrid';

/* ---------------------------------------------------------------------
 TYPES
---------------------------------------------------------------------- */
type CardProps = {
  icon: ReactNode;
  title: string;
  desc: string;
};

type TestimonialProps = {
  quote: string;
  author: string;
};

/* ---------------------------------------------------------------------
 PAGE
---------------------------------------------------------------------- */
export default function HomePage() {
  const { open } = useModal();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="pt-24 md:pt-32 pb-20 text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-[#1A2540] leading-tight"
        >
          Verify Renters. Prevent Fraud.{" "}
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
            onClick={() => open("searchRenter")}
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

      {/* =====================================================
          WHAT RENTFAX PROTECTS YOU FROM
      ====================================================== */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
          What RentFAX Protects You From
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12 text-lg">
          Built to stop fraud before it turns into losses.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
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

      {/* =====================================================
          BUILT FOR EVERY RENTAL
      ====================================================== */}
      <section className="py-20 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
            Built for Every Rental Industry
          </h2>
          <p className="text-gray-600 mt-2 mb-10 text-lg">
            From individuals to global operators.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              "Residential Rentals",
              "Commercial Property",
              "Vehicle & Fleet Rentals",
              "Equipment & Tools",
              "Short-Term & Vacation Rentals",
              "Storage & Warehousing",
              "Peer-to-Peer Rentals",
              "Independent Owners & Agencies",
            ].map((item) => (
              <div
                key={item}
                className="p-4 bg-white rounded-lg shadow-sm font-medium text-gray-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
          How RentFAX Works
        </h2>
        <p className="text-center text-gray-600 mt-2 mb-12 text-lg">
          Three simple steps to protect your rentals.
        </p>

        <div className="grid md:grid-cols-3 gap-10">
          <StepCard
            icon={<BadgeCheck className="h-10 w-10 text-[#D4A017]" />}
            title="1. Enter Renter Details"
            desc="Search using name, phone, email, or address."
          />
          <StepCard
            icon={<Search className="h-10 w-10 text-[#D4A017]" />}
            title="2. Instant Analysis"
            desc="We analyze identity, incidents, and fraud signals."
          />
          <StepCard
            icon={<BarChart3 className="h-10 w-10 text-[#D4A017]" />}
            title="3. Take Action"
            desc="Verify identity or unlock a full risk report."
          />
        </div>
      </section>

      {/* =====================================================
          FAIR FOR RENTERS
      ====================================================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
            Fair for Renters. Protective for Owners.
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            RentFAX is designed to stop fraud — not punish honest renters.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
            <FairCard
              title="Consent-First Verification"
              desc="Renters are notified and can verify or deny rentals tied to their identity."
            />
            <FairCard
              title="Dispute Transparency"
              desc="Verification reduces false claims and protects both parties."
            />
            <FairCard
              title="Permanent Audit Trail"
              desc="All actions are logged for compliance, accountability, and legal clarity."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FRAUD STATS
      ====================================================== */}
      <section className="py-20 px-6 bg-[#1A2540] text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold">
          Rental Fraud Is Accelerating
        </h2>
        <p className="text-gray-300 mt-3 mb-12 max-w-2xl mx-auto text-lg">
          RentFAX helps reduce losses by detecting identity misuse and repeat fraud.
        </p>

        <div className="grid sm:grid-cols-3 gap-10 max-w-4xl mx-auto">
          <Stat number="11.6M" label="Rental fraud victims yearly" />
          <Stat number="$6.8B" label="Annual fraud losses" />
          <Stat number="42%" label="Reduction in identity mismatch" />
        </div>
      </section>

      {/* =====================================================
          TESTIMONIALS
      ====================================================== */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1A2540]">
          Trusted by Rental Businesses
        </h2>

        <div className="grid md:grid-cols-2 gap-10 mt-10">
          <Testimonial
            quote="RentFAX helped us catch identity fraud before keys were handed over."
            author="Regional Property Group"
          />
          <Testimonial
            quote="We flagged a repeat scammer immediately. This system paid for itself."
            author="Multi-City Equipment Rental Co."
          />
        </div>
      </section>

      {/* =====================================================
          BLOG SECTION
      ====================================================== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
                Insights & Rental Intelligence
              </h2>
              <p className="text-gray-600 mt-2 text-lg">
                Fraud prevention, identity verification, and renter trust — explained.
              </p>
            </div>

            <Link
              href="/blog"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#1A2540] hover:underline"
            >
              View all articles →
            </Link>
          </div>

          <BlogGrid />
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="py-20 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
          Start Screening with Confidence
        </h2>
        <p className="text-gray-600 mt-3 mb-8 text-lg">
          Protect your rentals with verified identity and fraud intelligence.
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => open("searchRenter")}
            className="px-8 py-3 bg-[#1A2540] text-white font-semibold rounded-lg shadow hover:bg-[#2a3660] transition"
          >
            Start Screening
          </button>
        </div>
      </section>

    </main>
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

function StepCard({ icon, title, desc }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-8 shadow-sm border"
    >
      {icon}
      <h3 className="font-semibold text-xl mt-4">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </motion.div>
  );
}

function FairCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <h3 className="text-5xl font-bold text-[#D4A017]">{number}</h3>
      <p className="text-gray-300 mt-2 text-lg">{label}</p>
    </div>
  );
}

function Testimonial({ quote, author }: TestimonialProps) {
  return (
    <div className="bg-white p-8 shadow-sm border rounded-xl">
      <p className="text-gray-700 italic text-lg">“{quote}”</p>
      <p className="mt-4 font-semibold text-[#1A2540]">{author}</p>
    </div>
  );
}
