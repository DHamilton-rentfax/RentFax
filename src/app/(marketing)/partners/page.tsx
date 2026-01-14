
'use client';

import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="container mx-auto px-6 py-24">
      {/* Hero */}
      <section className="max-w-4xl mb-16">
        <h1 className="text-4xl font-extrabold text-[#1A2540]">
          RentFAX Partner Program
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Work with RentFAX to create safer rental ecosystems through data,
          transparency, and responsible risk intelligence.
        </p>
      </section>

      {/* Why Partner */}
      <section className="grid md:grid-cols-3 gap-8 mb-20">
        <div className="border rounded-xl p-6">
          <h3 className="font-semibold text-lg">Trusted Data Network</h3>
          <p className="text-sm text-gray-600 mt-2">
            Access verified renter behavior signals, fraud indicators, and dispute history.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="font-semibold text-lg">Mutual Value Creation</h3>
          <p className="text-sm text-gray-600 mt-2">
            Partners gain visibility while helping reduce fraud and bad actors across industries.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="font-semibold text-lg">Enterprise-Grade Infrastructure</h3>
          <p className="text-sm text-gray-600 mt-2">
            Secure APIs, audit logs, and compliance-ready tooling built for scale.
          </p>
        </div>
      </section>

      {/* Partner Programs */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Partner Programs</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">Legal & Compliance Partners</h3>
            <p className="text-sm text-gray-600 mt-2">
              Law firms, compliance providers, and legal service platforms that support
              dispute resolution, filings, and regulatory workflows.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">Collection & Recovery Agencies</h3>
            <p className="text-sm text-gray-600 mt-2">
              Agencies working with verified rental incidents, payment disputes,
              and historical renter behavior.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">Property & Fleet Platforms</h3>
            <p className="text-sm text-gray-600 mt-2">
              PMS systems, fleet software, and rental platforms integrating RentFAX
              reports directly into their workflows.
            </p>
          </div>

          <div className="border rounded-xl p-6">
            <h3 className="font-semibold text-lg">Developers & Integrations</h3>
            <p className="text-sm text-gray-600 mt-2">
              Build on RentFAX using secure APIs to enable identity verification,
              risk scoring, and renter history checks.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 border rounded-2xl p-10 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Interested in partnering with RentFAX?
        </h3>
        <p className="text-gray-600 mb-6">
          Let’s explore how we can work together responsibly.
        </p>
        <Link
          href="/contact?subject=Partner+Inquiry"
          className="inline-block bg-[#1A2540] text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition"
        >
          Contact Partnerships
        </Link>
      </section>
    </div>
  );
}
