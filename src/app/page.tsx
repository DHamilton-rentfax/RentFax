"use client";
import { useState } from "react";
import { ScreeningModal } from "@/components/ui/screening-modal";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gradient-to-b from-white via-[#F8FAFC] to-[#E8ECF5]">
      {/* Hero Section */}
      <section className="text-center py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4E]/10 to-transparent pointer-events-none"></div>

        <h1 className="text-6xl font-extrabold leading-tight tracking-tight mb-6 max-w-4xl mx-auto text-[#1B2A4E]">
          Screen Renters. Verify Drivers. <br />
          <span className="text-[#E6B422]">Prevent Fraud.</span>
        </h1>

        <p className="text-lg text-[#64748B] max-w-2xl mx-auto mb-10">
          AI-powered verification for property, car, and equipment rentals. 
          Protect your business with instant fraud detection and dispute automation.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => setOpen(true)}
            className="px-8 py-4 bg-[#1B2A4E] text-white rounded-xl hover:bg-[#E6B422] hover:text-[#1B2A4E] transition text-lg font-semibold shadow-md"
          >
            Start Screening
          </button>
          <a
            href="/how-it-works"
            className="px-8 py-4 border border-[#1B2A4E] text-[#1B2A4E] rounded-xl hover:bg-[#E6B422]/10 transition text-lg font-semibold"
          >
            Learn More
          </a>
        </div>

        <div className="mt-20 max-w-5xl mx-auto grid md:grid-cols-3 gap-12 text-left">
          {[
            {
              title: "Cross-Industry Verification",
              desc: "Screen renters, drivers, or borrowers instantly with multi-source validation.",
            },
            {
              title: "AI Fraud Detection",
              desc: "Detect duplicate applications, mismatched identities, and behavioral risk.",
            },
            {
              title: "Automated Dispute Resolution",
              desc: "Allow renters to upload evidence and resolve issues with a clear audit trail.",
            },
          ].map((f) => (
            <div key={f.title}>
              <h3 className="text-xl font-semibold text-[#1B2A4E] mb-2">
                {f.title}
              </h3>
              <p className="text-[#64748B]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1B2A4E] text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Protect your business with verified data.
        </h2>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#E6B422] text-[#1B2A4E] px-8 py-3 rounded-lg font-semibold hover:bg-[#F7CC48] transition"
        >
          Screen a Renter
        </button>
      </section>

      <ScreeningModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
