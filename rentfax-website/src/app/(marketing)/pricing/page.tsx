
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | RentFAX",
  description:
    "Simple, transparent pricing for renter verification, fraud detection, and rental risk intelligence.",
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <h1 className="text-5xl font-bold text-[#1A2540] mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Choose the plan that fits your rental volume. Upgrade anytime. No hidden fees.
        </p>
      </section>

      {/* PLANS */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* PAY AS YOU GO */}
          <div className="border rounded-2xl p-6 shadow-sm bg-white flex flex-col">
            <h2 className="text-xl font-bold mb-2">Pay As You Go</h2>
            <p className="text-gray-600 mb-4">
              Run a report only when you need one.
            </p>

            <p className="text-4xl font-bold mb-6">$20</p>

            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• Full renter risk report</li>
              <li>• Identity & fraud signals</li>
              <li>• Incident & dispute history</li>
              <li>• No subscription</li>
            </ul>

            <a
              href="https://app.rentfax.io/search?source=marketing-pricing-payg"
              className="mt-auto text-center bg-[#1A2540] text-white py-3 rounded-lg font-semibold hover:bg-[#11182c]"
            >
              Run a Report
            </a>
          </div>

          {/* STARTER */}
          <div className="border rounded-2xl p-6 shadow-sm bg-white flex flex-col">
            <h2 className="text-xl font-bold mb-2">Starter</h2>
            <p className="text-gray-600 mb-4">
              For independent landlords and small fleets.
            </p>

            <p className="text-4xl font-bold mb-6">$199/mo</p>

            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• 50 risk reports / month</li>
              <li>• Incident & dispute tracking</li>
              <li>• Renter alerts</li>
              <li>• Email support</li>
            </ul>

            <a
              href="https://app.rentfax.io/signup?plan=starter&source=marketing-pricing"
              className="mt-auto text-center bg-[#1A2540] text-white py-3 rounded-lg font-semibold hover:bg-[#11182c]"
            >
              Get Starter
            </a>
          </div>

          {/* PROFESSIONAL */}
          <div className="border-2 border-[#1A2540] rounded-2xl p-6 shadow-md bg-white flex flex-col relative">
            <span className="absolute -top-3 right-4 bg-[#1A2540] text-white text-xs px-3 py-1 rounded-full">
              Most Popular
            </span>

            <h2 className="text-xl font-bold mb-2">Professional</h2>
            <p className="text-gray-600 mb-4">
              Built for agencies and growing operations.
            </p>

            <p className="text-4xl font-bold mb-6">$499/mo</p>

            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• 300 risk reports / month</li>
              <li>• Portfolio analytics</li>
              <li>• Risk trends & insights</li>
              <li>• Priority support</li>
            </ul>

            <a
              href="https://app.rentfax.io/signup?plan=professional&source=marketing-pricing"
              className="mt-auto text-center bg-[#1A2540] text-white py-3 rounded-lg font-semibold hover:bg-[#11182c]"
            >
              Get Professional
            </a>
          </div>

          {/* BUSINESS */}
          <div className="border rounded-2xl p-6 shadow-sm bg-white flex flex-col">
            <h2 className="text-xl font-bold mb-2">Business</h2>
            <p className="text-gray-600 mb-4">
              High-volume screening with team access.
            </p>

            <p className="text-4xl font-bold mb-6">$799/mo</p>

            <ul className="text-sm text-gray-700 space-y-2 mb-6">
              <li>• 600 risk reports / month</li>
              <li>• Team access</li>
              <li>• Audit logs</li>
              <li>• Advanced monitoring</li>
            </ul>

            <a
              href="https://app.rentfax.io/signup?plan=business&source=marketing-pricing"
              className="mt-auto text-center bg-[#1A2540] text-white py-3 rounded-lg font-semibold hover:bg-[#11182c]"
            >
              Get Business
            </a>
          </div>
        </div>
      </section>

      {/* ENTERPRISE CTA */}
      <section className="py-20 px-6 text-center bg-slate-50 border-t">
        <h2 className="text-3xl font-bold text-[#1A2540] mb-4">
          Need Enterprise?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Custom volumes, API access, SLAs, compliance support, and dedicated onboarding.
        </p>

        <a
          href="https://app.rentfax.io/contact?subject=Enterprise+Inquiry"
          className="inline-block px-8 py-3 bg-[#1A2540] text-white rounded-lg font-semibold hover:bg-[#11182c]"
        >
          Contact Sales
        </a>
      </section>

      {/* LEGAL LINKS */}
      <section className="py-10 text-center text-sm text-gray-500">
        <p>
          Pricing subject to our{" "}
          <a href="/terms" className="text-blue-600 font-semibold">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 font-semibold">
            Privacy Policy
          </a>.
        </p>
      </section>
    </main>
  );
}
