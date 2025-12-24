import { Metadata } from "next";
import {
  BrainCircuit,
  Fingerprint,
  FileText,
  GitBranch,
  ShieldCheck,
  Gauge,
  Layers,
  Network,
  ListChecks,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology | RentFAX",
  description:
    "Learn how RentFAX evaluates identity integrity, incident history, fraud signals, timelines, and behavioral risk using transparent, non-discriminatory methods.",
};

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <BrainCircuit className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-[#1A2540] mb-6">RentFAX Methodology</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Transparent, explainable, behavior-based methodology designed to make renting safer,
          fairer, and more accountable — without relying on protected characteristics or opaque scoring systems.
        </p>
      </section>

      {/* GUIDING PRINCIPLES */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Guiding Principles
        </h2>

        <ul className="grid md:grid-cols-2 gap-10 text-gray-700 text-sm leading-relaxed">
          <li className="bg-white border rounded-xl p-8 shadow-sm">
            <ShieldCheck className="h-8 w-8 text-blue-600 mb-3" />
            <strong>Fairness Before Prediction</strong>
            <p className="mt-2">
              RentFAX methodology avoids protected classes entirely. We only analyze
              rental behavior, documented incidents, dispute outcomes, and identity integrity.
            </p>
          </li>

          <li className="bg-white border rounded-xl p-8 shadow-sm">
            <Fingerprint className="h-8 w-8 text-blue-600 mb-3" />
            <strong>Identity Integrity First</strong>
            <p className="mt-2">
              Fraud signals can dramatically change risk, so identity consistency and verification status
              influence how other factors are weighted.
            </p>
          </li>

          <li className="bg-white border rounded-xl p-8 shadow-sm">
            <GitBranch className="h-8 w-8 text-blue-600 mb-3" />
            <strong>Timelines Matter</strong>
            <p className="mt-2">
              Behavior is evaluated in the context of time — short bursts of severe incidents differ
              from events spaced over many years.
            </p>
          </li>

          <li className="bg-white border rounded-xl p-8 shadow-sm">
            <ListChecks className="h-8 w-8 text-blue-600 mb-3" />
            <strong>Explainability</strong>
            <p className="mt-2">
              Every insight served in RentFAX is tied to documented evidence. No “mystery scores,”
              and renters can view and dispute contributing items.
            </p>
          </li>
        </ul>
      </section>

      {/* FACTOR CATEGORIES */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">What Our Methodology Evaluates</h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">1. Identity Integrity</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We validate consistency across submitted data points:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>Name, address, and DOB alignment</li>
                <li>Phone and email reuse across incidents</li>
                <li>Mismatched or recycled contact patterns</li>
                <li>Document verification quality (if provided)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">2. Incident History</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We categorize incidents into weighted groups:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>Non-payment or charge-offs</li>
                <li>Property damage or vehicle damage</li>
                <li>Behavioral incidents (aggression, policy violations)</li>
                <li>Administrative issues (fraud attempts, false identity)</li>
                <li>Positive resolutions (paid balances, successful appeals)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">3. Fraud Signals</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Proprietary fraud detection highlights patterns such as:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>Duplicate identity markers across profiles</li>
                <li>Impossible timelines across addresses</li>
                <li>Known fraudulent contact data patterns</li>
                <li>Conflicts between documents and reported identity</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">4. Behavioral Consistency</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We evaluate patterns across verified companies:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
                <li>Repeated late payments or disputes</li>
                <li>Inconsistent communication or evasion</li>
                <li>Resolution quality and renter cooperation</li>
                <li>Positive trends such as dispute wins or successful rentals</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE LOGIC */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Timeline Logic</h2>
        <p className="text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto text-center">
          Events in a renter’s history are not evaluated in isolation.
          The timeline engine reconstructs a chronological sequence of incidents,
          disputes, resolutions, and verification events.
        </p>

        <ul className="space-y-4 text-gray-700 text-sm leading-relaxed list-disc pl-6">
          <li>Recent severe incidents weigh more heavily than older minor ones</li>
          <li>Resolved disputes reduce risk weighting over time</li>
          <li>Long periods with no incidents increase reliability signals</li>
          <li>Fraud signals decay slowly, depending on severity</li>
        </ul>
      </section>

      {/* EXCLUSIONS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">What We Do NOT Consider</h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            RentFAX methodology avoids:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm leading-relaxed">
            <li>Race, ethnicity, national origin</li>
            <li>Gender identity or orientation</li>
            <li>Age (except when required for identity validation)</li>
            <li>Income level unrelated to rental performance</li>
            <li>Disability status or medical information</li>
            <li>Immigration status</li>
          </ul>

          <p className="text-gray-700 text-sm mt-6">
            RentFAX evaluates **behavior, documentation, and verified outcomes**, not protected characteristics.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">
          A Transparent, Evidence-Driven System
        </h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-8">
          This methodology supports the RentFAX Risk Score™, incident timelines, and
          dispute workflows — creating a fairer and safer rental ecosystem.
        </p>

        <a
          href="/risk-score"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Learn About Risk Score™
          <ArrowRight className="h-4 w-4" />
        </a>
      </section>

    </main>
  );
}
