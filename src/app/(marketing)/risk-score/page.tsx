import { Metadata } from "next";
import Link from "next/link";
import {
  Gauge,
  Info,
  ListChecks,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "RentFAX Risk Score™ | RentFAX",
  description:
    "Understand how the RentFAX Risk Score™ works, what it measures, and how it helps landlords and renters make fair, data-driven decisions.",
};

export default function RiskScorePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <Gauge className="h-12 w-12 mx-auto text-blue-600 mb-4" />
        <h1 className="text-5xl font-bold mb-4 text-[#1A2540]">
          RentFAX Risk Score™
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          A transparent, behavior-driven signal to help landlords and renters understand
          risk—not a secret blacklist, and not a one-number verdict.
        </p>
      </section>

      {/* WHAT IT IS */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">What the Score Represents</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The RentFAX Risk Score™ is a composite indicator of how risky a renter’s
            profile may be from a purely rental-operational perspective.
          </p>
          <p className="text-gray-700 leading-relaxed mb-3">
            It helps answer questions like:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            <li>Has this renter had multiple serious incidents in a short time?</li>
            <li>Do their identity details appear consistent across reports?</li>
            <li>Are there signals of chronic non-payment, charge-offs, or damage?</li>
            <li>Have prior disputes been resolved quickly and cooperatively?</li>
          </ul>
        </div>

        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <Info className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Score Range & Interpretation</h3>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            The Score typically ranges on a numeric scale (for example, 0–100) where
            higher values generally indicate more confidence in reliability and
            lower relative risk—based on documented rental behavior.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Exact ranges and thresholds can be customized for enterprise customers
            and should always be used alongside human review and local rules.
          </p>
        </div>
      </section>

      {/* INPUTS & EXCLUSIONS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              What Factors Influence the RentFAX Risk Score™
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              <li>Number and severity of documented incidents</li>
              <li>Patterns of missed payments, charge-offs, or unresolved balances</li>
              <li>Verification confidence (ID match quality, document consistency)</li>
              <li>Fraud signals and identity anomalies</li>
              <li>Dispute outcomes, cooperation, and resolution history</li>
              <li>Cross-company consistency of behavior over time</li>
            </ul>
            <p className="text-gray-700 text-sm mt-4">
              Learn more in our detailed{" "}
              <Link href="/methodology" className="text-blue-600 hover:underline">
                Methodology
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">What Is Explicitly Excluded</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              The Score does <span className="font-semibold">not</span> use or infer
              protected characteristics or unrelated personal attributes. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              <li>Race, ethnicity, or national origin</li>
              <li>Gender or gender identity</li>
              <li>Religion or beliefs</li>
              <li>Sexual orientation</li>
              <li>Disability status or medical data</li>
              <li>Any other legally protected class or sensitive signals</li>
            </ul>
            <p className="text-gray-700 text-xs mt-4">
              RentFAX is designed to evaluate documented rental behavior and identity integrity—
              not who someone is.
            </p>
          </div>
        </div>
      </section>

      {/* HOW LANDLORDS SHOULD USE IT */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div className="bg-white border rounded-2xl p-8 shadow-sm">
          <ListChecks className="h-9 w-9 text-blue-600 mb-3" />
          <h2 className="text-xl font-semibold mb-2">For Landlords & Operators</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            The Score is a decision-support tool—not a replacement for judgment,
            policy, or local law.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            <li>Use it to prioritize deeper review, not auto-reject.</li>
            <li>Always consider disputes, renter context, and local regulations.</li>
            <li>Align internal thresholds with your risk tolerance and policies.</li>
          </ul>
          <p className="text-gray-700 text-xs mt-4">
            RentFAX does not make leasing decisions. Each landlord or company retains full responsibility for approvals or denials.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">For Renters</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            Renters can influence their long-term Risk Score™ through:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm mb-3">
            <li>Resolving disputes and unpaid balances where possible</li>
            <li>Providing clear documentation and responses when issues occur</li>
            <li>Maintaining on-time payments and responsible property use</li>
            <li>Keeping identity and contact information consistent</li>
          </ul>
          <p className="text-gray-700 text-sm leading-relaxed">
            Over time, positive behavior and resolved issues can be reflected in the 
            overall risk picture.
          </p>
        </div>
      </section>

      {/* DISCLAIMERS / FAIR USE */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-start gap-3 mb-6">
            <AlertCircle className="h-7 w-7 text-amber-500 mt-1" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Important Disclaimer</h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                The RentFAX Risk Score™ is provided “as-is” as an informational tool and does
                not constitute legal advice, a consumer report, or a definitive statement 
                of character. It must be used in accordance with applicable laws, your own 
                policies, and fair-housing regulations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="h-7 w-7 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Designed for Fairness</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Our goal is to elevate high-quality renters, give landlords better visibility,
                and minimize preventable loss—while keeping fairness, transparency, and renter
                rights at the center of the system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">See the Risk Score™ in Action</h2>
        <p className="text-gray-700 max-w-xl mx-auto mb-8">
          Experience how the RentFAX Risk Score™ fits into full renter reports, incident
          timelines, and dispute workflows.
        </p>
        <Link
          href="/demo"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Request a Demo
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
