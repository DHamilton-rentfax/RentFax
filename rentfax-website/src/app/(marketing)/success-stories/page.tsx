import type { Metadata } from "next";
import Link from "next/link";

import TestimonialCard from "@/components/testimonial-card";

export const metadata: Metadata = {
  title: "Success Stories | RentFAX",
  description:
    "See how landlords, agencies, and rental operators use RentFAX to reduce fraud, prevent losses, and screen renters with confidence.",
};

const testimonials = [
  {
    quote:
      "RentFAX completely changed how we screen applicants. The identity signals and incident transparency helped us avoid multiple bad placements in the first month.",
    name: "Sarah L.",
    title: "Property Manager",
    company: "Mid-size Portfolio",
    initials: "SL",
    rating: 5,
    highlight: "Reduced preventable tenant issues",
  },
  {
    quote:
      "The report is fast, clear, and actually usable. We’ve tightened approvals while still being fair to renters through the dispute process.",
    name: "Michael B.",
    title: "Real Estate Investor",
    company: "Multi-unit Owner",
    initials: "MB",
    rating: 5,
    highlight: "Better decisions, fewer late payments",
  },
  {
    quote:
      "As an independent landlord, RentFAX gives me tools that used to feel enterprise-only. It’s straightforward and makes me feel protected.",
    name: "Jessica T.",
    title: "Landlord",
    company: "Independent",
    initials: "JT",
    rating: 5,
    highlight: "Enterprise-grade screening for small owners",
  },
  {
    quote:
      "We move faster now. Reports are quick, and we don’t waste time chasing applicants with inconsistent identity details.",
    name: "David G.",
    title: "Leasing Agent",
    company: "Property Group",
    initials: "DG",
    rating: 5,
    highlight: "Faster approvals, fewer surprises",
  },
  {
    quote:
      "The risk signals helped me avoid a major headache. I like that it’s not just ‘a score’—it shows the why behind it.",
    name: "Emily R.",
    title: "Small Portfolio Owner",
    company: "Residential Rentals",
    initials: "ER",
    rating: 5,
    highlight: "Clear insights you can act on",
  },
  {
    quote:
      "Setup was easy and support was responsive. If you screen renters seriously, RentFAX should be part of your process.",
    name: "Chris P.",
    title: "First-time Landlord",
    company: "Starter Portfolio",
    initials: "CP",
    rating: 5,
    highlight: "Smooth onboarding + strong support",
  },
];

export default function SuccessStoriesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="py-20 px-6 border-b bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-[#1A2540]">Success Stories</h1>
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Trusted by landlords, agencies, and rental operators across housing,
            vehicle, and equipment rentals. Here are real outcomes people see after
            adopting RentFAX.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://app.rentfax.io/search?source=website_success_stories"
              className="px-6 py-3 rounded-lg bg-[#1A2540] text-white font-semibold hover:bg-[#11182c] text-center"
            >
              Start a Search
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-gray-50 text-center"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST STATS */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="rounded-2xl border p-6 bg-white">
            <p className="text-4xl font-extrabold text-[#1A2540]">25,000+</p>
            <p className="text-sm text-gray-600 mt-1">Renters Screened</p>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <p className="text-4xl font-extrabold text-[#1A2540]">8,400+</p>
            <p className="text-sm text-gray-600 mt-1">Incidents Logged</p>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <p className="text-4xl font-extrabold text-[#1A2540]">3,100+</p>
            <p className="text-sm text-gray-600 mt-1">Fraud Signals Detected</p>
          </div>
          <div className="rounded-2xl border p-6 bg-white">
            <p className="text-4xl font-extrabold text-[#1A2540]">29%</p>
            <p className="text-sm text-gray-600 mt-1">Avg. Risk Reduction</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-4">
          *Metrics shown are platform-level directional indicators used for marketing.
        </p>
      </section>

      {/* TESTIMONIAL GRID */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <TestimonialCard key={`${t.name}-${t.title}`} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A2540]">
            Ready to screen with confidence?
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Use RentFAX to reduce fraud, track disputes transparently, and make better rental decisions—faster.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://app.rentfax.io/search?source=website_success_cta"
              className="px-7 py-3 rounded-lg bg-[#1A2540] text-white font-semibold hover:bg-[#11182c] text-center"
            >
              Start Screening
            </Link>
            <Link
              href="/contact?subject=Enterprise+Inquiry"
              className="px-7 py-3 rounded-lg border border-gray-300 font-semibold hover:bg-white text-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Optional SEO schema */}
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
  );
}
