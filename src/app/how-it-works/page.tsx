"use client";

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    title: '1. Upload Renter Data Securely',
    description: 'Easily import renter information via our dashboard, a simple CSV upload, or by integrating our API into your existing property management software. All data is encrypted in transit and at rest.',
    align: 'left',
  },
  {
    title: '2. AI-Powered Risk Analysis',
    description: 'Our proprietary AI models analyze thousands of data points to generate a comprehensive risk score. We go beyond simple credit checks, assessing eviction history, income stability, and behavioral patterns.',
    align: 'right',
  },
  {
    title: '3. Instant Fraud Alerts & Scoring',
    description: 'Receive real-time alerts for suspicious activities, such as manipulated documents or synthetic identities. Our multi-layered fraud detection system helps you stop fraudsters before they become a liability.',
    align: 'left',
  },
  {
    title: '4. Streamlined Dispute Resolution',
    description: 'Manage renter disputes through our centralized portal. Renters can submit evidence, and you can resolve cases efficiently with AI-suggested actions, maintaining a clear and compliant audit trail.',
    align: 'right',
  },
  {
    title: '5. Compliance & Portfolio Analytics',
    description: 'Access a full suite of analytics to monitor portfolio risk, track key metrics, and ensure compliance with fair housing regulations. Generate reports for stakeholders and investors with a single click.',
    align: 'left',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="bg-gray-50 py-20 text-center">
        <h1 className="text-4xl font-bold">How RentFAX Works</h1>
        <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
          From renter onboarding to risk mitigation, RentFAX provides an end-to-end platform to protect your properties and streamline your operations.
        </p>
      </section>

      {/* Steps */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                step.align === 'right' ? 'md:grid-flow-col-dense' : ''
              }`}
            >
              <div className={step.align === 'right' ? 'md:col-start-2' : ''}>
                <h2 className="text-2xl font-bold mb-4">{step.title}</h2>
                <p className="text-gray-600 mb-6">{step.description}</p>
                <Link
                  href="/signup"
                  className="inline-block px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </div>
              <div className="bg-gray-100 rounded-lg p-8 h-64 flex items-center justify-center">
                 {/* Placeholder for illustration */}
                 <p className="text-gray-400">Illustration for {step.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Why RentFAX */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold">More Than a Background Check</h2>
            <p className="mt-4 text-gray-600">
            Traditional background checks are reactive. RentFAX is proactive. We provide the forward-looking intelligence you need to make smarter decisions, reduce risk, and build a more profitable rental portfolio.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-8">
                <div className="p-6">
                    <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h3 className="mt-4 font-semibold">Reduce Evictions</h3>
                    <p className="mt-2 text-sm text-gray-600">Stop problem renters before they move in.</p>
                </div>
                <div className="p-6">
                    <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h3 className="mt-4 font-semibold">Prevent Fraud</h3>
                    <p className="mt-2 text-sm text-gray-600">Detect fake pay stubs and synthetic IDs.</p>
                </div>
                <div className="p-6">
                    <CheckCircle className="h-8 w-8 text-emerald-600 mx-auto" />
                    <h3 className="mt-4 font-semibold">Stay Compliant</h3>
                    <p className="mt-2 text-sm text-gray-600">Automate fair housing compliance and reporting.</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to See It in Action?</h2>
        <p className="mt-4 max-w-2xl mx-auto text-emerald-100">
          Get started with a free risk report or schedule a demo to see how RentFAX can transform your business.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-white text-emerald-700 font-medium hover:bg-gray-100"
          >
            Start Free
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border border-white text-white hover:bg-emerald-700 hover:border-emerald-700"
          >
            Book a Demo
          </Link>
        </div>
      </section>
    </main>
  );
}
