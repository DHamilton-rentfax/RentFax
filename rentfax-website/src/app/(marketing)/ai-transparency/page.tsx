import { Metadata } from "next";
import {
  BrainCircuit,
  Eye,
  ShieldCheck,
  Scale,
  Gauge,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Transparency | RentFAX",
  description:
    "How RentFAX uses AI responsibly for fraud detection, risk scoring, and pattern analysis with fairness, explainability, and strict guardrails.",
};

export default
function AITransparencyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <BrainCircuit className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-[#1A2540] mb-6">AI Transparency</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          RentFAX uses AI for pattern recognition, identity consistency checks, and risk insights—
          never for automated leasing decisions. Human judgment remains central.
        </p>
      </section>

      {/* USE OF AI */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

        <div>
          <h2 className="text-2xl font-bold mb-4">How AI Is Used at RentFAX</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            RentFAX AI assists landlords and renters by identifying anomalies, organizing
            timelines, generating insights, and highlighting fraud patterns.
          </p>

          <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
            <li>Fraud signal clustering (duplicate identifiers, mismatches)</li>
            <li>Identity integrity analysis</li>
            <li>Behavioral trend detection</li>
            <li>Risk Score™ support and weighting guidance</li>
            <li>Natural-language insights and summarization</li>
          </ul>
        </div>

        <div className="bg-white border rounded-xl p-8 shadow-sm">
          <Eye className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">No Black-Box Decisions</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            RentFAX does not make automated leasing decisions or approvals.  
            AI outputs are suggestions or insights — never verdicts.
          </p>
        </div>
      </section>

      {/* FAIRNESS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">
            Fairness, Non-Discrimination & Model Governance
          </h2>

          <div className="grid md:grid-cols-2 gap-12">

            <div>
              <Scale className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold mb-3">Fairness by Design</h3>
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                RentFAX AI excludes protected-class inputs, including:
              </p>
              <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
                <li>Race, ethnicity, religion</li>
                <li>Gender or sexual orientation</li>
                <li>Age (except ID-required age verification)</li>
                <li>Medical data or disability status</li>
                <li>Immigration status</li>
              </ul>
            </div>

            <div>
              <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold mb-3">Human Oversight</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Landlords and renters can review all AI-assisted insights.
                Every suggestion is explainable and tied to visible evidence or data points.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* LIMITATIONS */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <AlertTriangle className="h-10 w-10 text-amber-500 mb-3" />
        <h2 className="text-2xl font-bold mb-4">AI Limitations & Guardrails</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          RentFAX AI may highlight patterns or inconsistencies but:
        </p>

        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
          <li>Does not claim certainty or guarantees</li>
          <li>Does not replace human review</li>
          <li>Does not evaluate protected classes or personal attributes</li>
          <li>May occasionally produce errors — subject to renter and landlord correction</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-slate-50 border-t">
        <a
          href="/methodology"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          View Full Methodology
        </a>
      </section>

    </main>
  );
}
