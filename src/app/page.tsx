// src/app/page.tsx
"use client";

import Link from "next/link";

export default function RentfaxHome() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h1 className="text-5xl font-bold">
            The Credit Score for Renters
          </h1>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            RentFAX helps rental companies instantly evaluate risk, prevent fraud,
            and protect revenue with AI-powered renter scoring.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-lg bg-white text-blue-700 font-medium hover:bg-gray-100"
            >
              View Pricing
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 rounded-lg bg-blue-500 text-white border border-white font-medium hover:bg-blue-400"
            >
              Start Free
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: "Upload Renter", desc: "Enter renter details or upload in bulk." },
              { title: "Get Instant Risk Score", desc: "AI analyzes data for fraud & risk." },
              { title: "Decide with Confidence", desc: "Approve, deny, or flag renters quickly." },
            ].map((step, idx) => (
              <div key={idx} className="p-6 border rounded-2xl shadow-sm hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                <p className="mt-4 text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { title: "Fraud Detection", desc: "Detect duplicate IDs, shared addresses, and red flags." },
              { title: "AI Risk Assistant", desc: "Receive AI-driven recommendations for renters." },
              { title: "Dispute Portal", desc: "Streamlined renter dispute resolution workflow." },
              { title: "Compliance Reports", desc: "Export data for insurance, regulators, and legal." },
              { title: "Analytics Dashboard", desc: "Track renter trends and portfolio risk exposure." },
              { title: "Team Controls", desc: "Role-based access for enterprise teams." },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                <p className="mt-4 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Pricing Plans</h2>
          <p className="mt-4 text-gray-600">Choose the plan that fits your business.</p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { name: "Risk Report", price: "$20 / report", features: ["Pay-as-you-go", "Single renter check"] },
              { name: "Pro", price: "$149 / mo", features: ["Unlimited reports", "AI Risk Assistant", "Fraud detection"] },
              { name: "Unlimited", price: "$299 / mo", features: ["All Pro features", "Enterprise seats", "Full analytics"] },
            ].map((plan, idx) => (
              <div key={idx} className="p-8 border rounded-2xl shadow-sm hover:shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">{plan.price}</p>
                <ul className="mt-6 space-y-2 text-gray-600">
                  {plan.features.map((f, i) => <li key={i}>✔ {f}</li>)}
                </ul>
                <Link
                  href="/signup"
                  className="mt-6 inline-block px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Optional Add-Ons</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { title: "AI Risk Optimization", desc: "Advanced AI insights for risk management", price: "$49 / mo" },
              { title: "Priority Support", desc: "Faster response times & dedicated success manager", price: "$99 / mo" },
              { title: "Extra Team Seats", desc: "Scale your team with additional seats", price: "$10 / seat" },
            ].map((addon, idx) => (
              <div key={idx} className="p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">{addon.title}</h3>
                <p className="mt-2 text-gray-900 font-bold">{addon.price}</p>
                <p className="mt-4 text-gray-600">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-white font-semibold">RentFAX</h3>
            <p className="mt-4 text-sm">
              The credit score for renters. Protect your fleet, property, and business with AI-powered risk scoring.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/careers">Careers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/docs">Documentation</Link></li>
              <li><Link href="/api">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/legal/terms">Terms</Link></li>
              <li><Link href="/legal/privacy">Privacy</Link></li>
              <li><Link href="/legal/security">Security</Link></li>
              <li><Link href="/status">Status</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} RentFAX. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
