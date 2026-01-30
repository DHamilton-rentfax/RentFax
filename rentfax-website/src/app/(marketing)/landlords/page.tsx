"use client";

import { CheckCircle, ShieldCheck, LineChart, Users, TrendingDown, AlertTriangle, BarChart3 } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';

export default function LandlordsPage() {
  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* HERO */}
      <section className="text-center py-28 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
        >
          Protect Your Properties with <span className="text-yellow-300">AI-Powered Screening</span>
        </motion.h1>
        <p className="max-w-2xl mx-auto text-lg text-blue-100">
          RentFAX detects fraud, predicts tenant reliability, and safeguards landlord income — before
          the lease is signed.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => handleRedirect('https://app.rentfax.io/search?source=landlords-report')}
            className="px-8 py-3 bg-white text-blue-700 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition"
          >
            Run a Report
          </button>
          <button
            onClick={() => handleRedirect('https://app.rentfax.io/contact?source=landlords-demo')}
            className="px-8 py-3 bg-yellow-400 text-black rounded-lg font-semibold shadow-md hover:bg-yellow-300 transition"
          >
            Book a Demo
          </button>
        </div>

        {/* INDUSTRY STATS */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 text-center">
          {[
            {
              icon: <AlertTriangle className="h-8 w-8 text-yellow-300 mx-auto mb-3" />,
              label: "U.S. Rent Fraud Losses (2024)",
              value: 3.2,
              suffix: "B",
              subtext: "in damages and unpaid rent annually",
            },
            {
              icon: <TrendingDown className="h-8 w-8 text-yellow-300 mx-auto mb-3" />,
              label: "Eviction Filings per Year",
              value: 3.6,
              suffix: "M",
              subtext: "cases — most from unverified renters",
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-yellow-300 mx-auto mb-3" />,
              label: "Bad Tenant Rate",
              value: 1,
              prefix: "1-in-",
              suffix: "6",
              subtext: "renters cause payment or property issues",
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {stat.icon}
              <h3 className="text-4xl font-extrabold text-white">
                <CountUp prefix={stat.prefix} end={stat.value} duration={3} decimals={stat.suffix === 'B' ? 1 : 0} />
                {stat.suffix}
              </h3>
              <p className="text-blue-100 font-medium">{stat.label}</p>
              <p className="text-sm text-blue-200">{stat.subtext}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white border-t">
        <h2 className="text-3xl font-semibold text-center mb-10">How RentFAX Works</h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {[
            {
              title: "1. Upload Applicant",
              desc: "Upload a tenant application or connect your PMS. RentFAX analyzes it instantly.",
            },
            {
              title: "2. Verify Identity",
              desc: "AI cross-checks documents, SSNs, and paystubs to catch fraud within seconds.",
            },
            {
              title: "3. Get Risk Score",
              desc: "Receive a transparent AI-generated Renter Trust Index (RTI) with key behavior factors.",
            },
            {
              title: "4. Decide Confidently",
              desc: "Accept or reject with full confidence backed by national rental intelligence data.",
            },
          ].map((s) => (
            <div key={s.title} className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition bg-white">
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS / IMPACT */}
      <section className="py-20 bg-slate-50 text-center">
        <h2 className="text-3xl font-semibold mb-12">The Real Cost of Bad Screening</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto px-6">
          {[
            {
              title: "$3.2B+",
              desc: "annual landlord losses due to fraudulent tenant applications",
            },
            {
              title: "41%",
              desc: "of small landlords experience unpaid rent or damage in the first year",
            },
            {
              title: "72%",
              desc: "say screening is their biggest administrative burden",
            },
          ].map((stat) => (
            <div key={stat.title} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition bg-white">
              <p className="text-5xl font-extrabold text-blue-700 mb-2">{stat.title}</p>
              <p className="text-gray-600">{stat.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-gray-500 max-w-2xl mx-auto mt-8">
          RentFAX helps you avoid these losses — turning tenant data into predictive insights that
          safeguard your revenue.
        </p>
      </section>

      {/* VALUE PROPOSITIONS */}
      <section className="py-20 bg-white border-t">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Why Landlords Choose <span className="text-blue-600">RentFAX</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          {[
            "Detect falsified documents and identity fraud with 98% accuracy.",
            "Predict missed rent payments before they happen using behavioral AI.",
            "Save up to 80% in screening costs vs. legacy background checks.",
            "Stay fully compliant with FCRA, HUD, and HIPAA frameworks.",
            "Benchmark tenant risk using nationwide RentFAX data intelligence.",
            "Display your 'Protected by RentFAX' trust badge on listings.",
          ].map((benefit) => (
            <div key={benefit} className="flex items-start p-4 border rounded-lg shadow-sm bg-white">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
              <p className="text-base font-medium text-gray-800">{benefit}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-slate-50 border-t">
        <h2 className="text-3xl font-semibold text-center mb-12">Trusted by Leading Property Firms</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto px-6">
          {[
            {
              name: "Karen D.",
              role: "Property Manager, UrbanStay",
              quote:
                "RentFAX saved us thousands in lost rent by catching fake paystubs. It’s now part of every tenant check we run.",
            },
            {
              name: "David L.",
              role: "Landlord, 14 Units",
              quote:
                "Before RentFAX, I relied on instinct. Now I know who’s reliable and who’s a risk — instantly.",
            },
            {
              name: "Sarah M.",
              role: "Regional Housing Director",
              quote:
                "We standardized screening across our offices with RentFAX. Compliance headaches? Gone.",
            },
          ].map((t) => (
            <div key={t.name} className="p-6 md:w-1/3 border rounded-lg shadow-sm hover:shadow-md transition bg-white">
              <p className="italic text-gray-600 mb-4">“{t.quote}”</p>
              <p className="font-semibold text-gray-900">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-4xl font-bold mb-4">Join the Future of Rental Intelligence</h2>
        <p className="text-lg text-blue-100 mb-8">
          Protect your properties, reduce risk, and make data-driven tenant decisions in minutes.
        </p>
        <button
          onClick={() => handleRedirect('https://app.rentfax.io/contact?source=landlords-waitlist')}
          className="px-10 py-4 bg-yellow-400 text-black rounded-lg font-semibold text-lg shadow-lg hover:bg-yellow-300 transition"
        >
          Request Early Access
        </button>
      </section>
    </main>
  );
}