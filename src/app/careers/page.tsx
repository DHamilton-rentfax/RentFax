"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const jobs = [
  { title: "Full-Stack Engineer", dept: "Engineering", location: "Remote (US)", type: "Full-time" },
  { title: "Frontend Developer (React/Next.js)", dept: "Engineering", location: "Remote (US/EU)", type: "Full-time" },
  { title: "Backend Engineer (Firebase/Stripe)", dept: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Manager", dept: "Product", location: "NYC or Remote", type: "Full-time" },
  { title: "UX/UI Designer", dept: "Design", location: "Contract-to-hire", type: "Full-time" },
  { title: "Growth Marketer", dept: "Marketing", location: "Remote", type: "Full-time" },
  { title: "Enterprise Sales Executive", dept: "Sales", location: "Remote", type: "Full-time" },
  { title: "Customer Success Manager", dept: "Operations", location: "Remote", type: "Full-time" },
  { title: "Data Analyst (Risk & AI)", dept: "Analytics", location: "Remote", type: "Full-time" },
];

export default function CareersPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      {/* Hero */}
      <section className="text-center mb-20">
        <h1 className="font-[var(--font-newsreader)] text-5xl md:text-6xl tracking-tight">
          Build the Future of Rental Intelligence
        </h1>
        <p className="mt-6 text-lg text-zinc-600 max-w-2xl mx-auto">
          Join us at RentFAX as we transform how rental businesses assess risk,
          detect fraud, and resolve disputes with AI-driven insights.
        </p>
      </section>

      {/* Open Roles */}
      <section>
        <h2 className="text-2xl font-semibold mb-8">Open Roles</h2>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="flex justify-between items-center p-5 border rounded-xl hover:shadow-md transition bg-white"
            >
              <div>
                <h3 className="text-lg font-medium">{job.title}</h3>
                <p className="text-sm text-zinc-500">
                  {job.dept} · {job.location} · {job.type}
                </p>
              </div>
              <Button asChild>
                <Link
                  href={`/careers/apply?role=${encodeURIComponent(job.title)}`}
                >
                  Apply
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mt-20 border-t border-black/5 pt-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Why Work With Us</h2>
        <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-medium">🌍 Remote-first culture</h3>
            <p className="text-zinc-600 mt-2">
              Work from anywhere, collaborate asynchronously, and join quarterly team retreats.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-medium">💸 Competitive salary + equity</h3>
            <p className="text-zinc-600 mt-2">
              We believe in ownership. You’ll share in the value we create.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-medium">🩺 Health & wellness</h3>
            <p className="text-zinc-600 mt-2">
              Comprehensive medical, dental, and vision insurance, plus mental health support.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="font-medium">📚 Growth & learning</h3>
            <p className="text-zinc-600 mt-2">
              Stipends for courses, books, and conferences to support your career development.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-2xl font-semibold">Don’t see your role?</h2>
        <p className="mt-2 text-zinc-600">
          We’re always looking for amazing people. Reach out to us!
        </p>
        <Button asChild className="mt-6" size="lg">
          <Link href="/contact">
            Contact Us
          </Link>
        </Button>
      </section>
    </div>
  );
}
