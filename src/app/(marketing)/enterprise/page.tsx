"use client";

import Link from "next/link";
import Image from "next/image";

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Enterprise Rental Risk Intelligence
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl mx-auto">
          Advanced identity verification, fraud detection, renter graph insights,
          and high-volume screening tools for nationwide rental operations.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/enterprise/apply"
            className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800"
          >
            Apply for Enterprise
          </Link>

          <Link
            href="/enterprise/white-label"
            className="px-8 py-4 border border-gray-300 text-gray-900 rounded-lg text-lg font-semibold hover:bg-gray-100"
          >
            White-Label Option
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">

          <Feature
            title="High-Volume Screening"
            desc="Screen thousands of renters monthly with automated identity and fraud checks."
          />
          <Feature
            title="AI Fraud Engine"
            desc="Flag suspicious patterns, duplicate identities, device anomalies, and cross-industry risks."
          />
          <Feature
            title="Renter Identity Graph"
            desc="Access unified renter histories across housing, automotive, equipment, vacation, and storage."
          />

          <Feature
            title="API Integrations"
            desc="Connect your fleet, property management, or rental system directly to RentFAX."
          />
          <Feature
            title="Team & Branch Controls"
            desc="Role-based permissions, branch segmentation, and enterprise auditing."
          />
          <Feature
            title="White-Label Add-On"
            desc="Deploy RentFAX under your brand, domain, and visual identity."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-black text-white text-center">
        <h2 className="text-4xl font-bold">Ready to Upgrade to Enterprise?</h2>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Protect your entire rental network with our enterprise-grade identity,
          scoring, and intelligence tools.
        </p>

        <div className="mt-10">
          <Link
            href="/enterprise/apply"
            className="px-10 py-4 bg-white text-black rounded-lg text-xl font-semibold hover:bg-gray-200"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
}

function Feature({ title, desc }: any) {
  return (
    <div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
    </div>
  );
}
