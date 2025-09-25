
"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, BarChart3, FileText, Sparkles } from "lucide-react";

export default function HomePage() {
  const logos = ["Urban Rentals NYC", "FleetCo", "PropManage", "DriveTrust", "LeaseGuard"];

  const features = [
    {
      title: "Fraud Detection",
      desc: "Catch duplicate IDs, shared addresses, and suspicious renters before they cost you money.",
      icon: ShieldCheck,
    },
    {
      title: "AI Risk Assistant",
      desc: "Get AI-driven recommendations with context on renter behavior and portfolio risk.",
      icon: Sparkles,
    },
    {
      title: "Dispute Resolution",
      desc: "Streamlined workflows to resolve renter disputes with audit-ready documentation.",
      icon: FileText,
    },
    {
      title: "Compliance Reporting",
      desc: "Generate reports for insurers, regulators, and courts in just a few clicks.",
      icon: BarChart3,
    },
    {
      title: "Analytics Dashboard",
      desc: "Track renter trends and business performance across your entire portfolio.",
      icon: BarChart3,
    },
    {
      title: "Team Controls",
      desc: "Enterprise-ready role-based permissions and activity logs for your staff.",
      icon: Users,
    },
  ];

  const blogs = [
    {
      title: "Why Fraud Detection is the Future of Rentals",
      excerpt: "Rental businesses lose billions annually to fraud. Learn how AI can protect your fleet.",
      author: "RentFAX Team",
      date: "Sept 12, 2025",
    },
    {
      title: "Top 5 Risks Every Rental Company Should Know",
      excerpt: "From chargebacks to disputes, here’s what keeps fleet owners awake at night.",
      author: "Jane Smith",
      date: "Sept 5, 2025",
    },
    {
      title: "Compliance in Rentals: A Practical Guide",
      excerpt: "Avoid lawsuits and fines with better compliance reporting built into your workflow.",
      author: "RentFAX Legal",
      date: "Aug 28, 2025",
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            The Credit Score for Renters
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Instant renter risk reports, AI fraud detection, and compliance tools
            that protect your business — big or small.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 transition"
            >
              Start Free
            </Link>
          </div>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block text-gray-300 hover:text-white underline"
            >
              Book Enterprise Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted Logos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            Trusted by rental businesses nationwide
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-6 text-gray-700 font-semibold">
            {logos.map((logo, idx) => (
              <div key={idx} className="text-lg">{logo}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-gray-600">
            Everything rental businesses need to manage risk — built in.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 border rounded-2xl shadow-md hover:shadow-xl transition bg-gradient-to-br from-gray-50 to-white"
              >
                <feature.icon className="mx-auto h-10 w-10 text-emerald-500" />
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center">From the RentFAX Blog</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {blogs.map((post, idx) => (
              <div
                key={idx}
                className="p-6 bg-white border rounded-xl shadow hover:shadow-md transition flex flex-col"
              >
                <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                <p className="mt-3 text-gray-600 flex-grow">{post.excerpt}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {post.author} — {post.date}
                </div>
                <Link
                  href="/blog"
                  className="mt-6 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to protect your rentals?</h2>
        <p className="mt-4 text-gray-300">
          Join rental businesses nationwide using RentFAX to manage renter risk.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-medium hover:bg-emerald-600"
          >
            Get Started
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-lg border border-white/30 text-white hover:bg-white/10"
          >
            Contact Sales
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-white font-semibold">RentFAX</h3>
            <p className="mt-4 text-sm">
              The credit score for renters. Protect your fleet, property, and
              business with AI-powered risk scoring.
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
