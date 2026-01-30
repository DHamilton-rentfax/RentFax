import { Metadata } from "next";
import {
  Cpu,
  BrainCircuit,
  ShieldCheck,
  Fingerprint,
  ChartBar,
  Layers,
  GitBranch,
  Server,
  Database,
  Lock,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Technology | RentFAX",
  description:
    "Discover the core technology behind RentFAX—AI fraud detection, identity intelligence, proprietary risk scoring models, secure multi-tenant architecture, and enterprise-grade data protection.",
};

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-28 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <h1 className="text-6xl font-bold mb-6 text-[#1A2540]">Inside the RentFAX Platform</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          Built with advanced identity intelligence, machine learning, fraud signal clustering,
          and enterprise-grade infrastructure. Designed to make renting safer, fairer, and more predictable.
        </p>
      </section>

      {/* SECTION: CORE ARCHITECTURE */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">
          The Core RentFAX Architecture
        </h2>

        <p className="text-gray-700 max-w-4xl mx-auto text-center mb-16 leading-relaxed">
          RentFAX combines multi-layer identity verification, probabilistic matching,
          behavioral analytics, and machine learning to generate transparent renter intelligence.
          Our platform is engineered for accuracy, fairness, and compliance at national scale.
        </p>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="border rounded-xl p-8 shadow-sm bg-white">
            <BrainCircuit className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Identity Intelligence Engine</h3>
            <p className="text-gray-700">
              Matches renters across submitted incidents, disputes, addresses, and documents using
              probabilistic + deterministic identity signals.
            </p>
          </div>

          <div className="border rounded-xl p-8 shadow-sm bg-white">
            <Fingerprint className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Proprietary Fraud Signals</h3>
            <p className="text-gray-700">
              Detects anomalies such as duplicate phones, mismatched addresses, impossible timelines,
              verified–unverified discrepancies, and identity conflicts.
            </p>
          </div>

          <div className="border rounded-xl p-8 shadow-sm bg-white">
            <Layers className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-3">Multi-Tenant Architecture</h3>
            <p className="text-gray-700">
              Company-level and landlord-level isolation ensures clean data boundaries, compliance,
              and enterprise-safe access permissions.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION: AI + FRAUD SIGNALS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-12 text-center">AI, Risk Scoring & Fraud Detection</h2>

          <div className="grid md:grid-cols-2 gap-12">

            <div>
              <h3 className="text-2xl font-semibold mb-4">Risk Score™ Methodology</h3>
              <p className="text-gray-700 mb-3 leading-relaxed">
                RentFAX’s Risk Score™ blends incident history, behavioral clusters,
                verification confidence, and fraud signals into a single transparent index.
              </p>

              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Identity verification strength</li>
                <li>Incident patterns (frequency + severity)</li>
                <li>Fraud signal density</li>
                <li>Dispute outcomes & renter cooperation</li>
                <li>Cross-company behavioral consistency</li>
              </ul>

              <p className="text-gray-700 mt-4 leading-relaxed">
                The model is non-discriminatory and avoids protected-class inputs, focusing only on
                behavior, verification, and documented incidents.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Fraud Signal Clustering</h3>
              <p className="text-gray-700 mb-4">
                Proprietary fraud features detect contradictions and high-risk behavior using a mix
                of statistical outliers, sequence analysis, and repeat-pattern detection.
              </p>

              <ul className="space-y-3 text-gray-700">
                <li>🔍 Duplicate identity markers</li>
                <li>⚠️ Mismatched phone → address → email clusters</li>
                <li>📌 False documentation indicators</li>
                <li>🧩 Prior inconsistent renter profiles</li>
                <li>🏚 Payment delinquency trajectories</li>
                <li>🛰 Location-to-event inconsistency patterns</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* SECTION: SECURITY */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold mb-10 text-center">Security & Data Protection</h2>

        <div className="grid md:grid-cols-3 gap-10">

          <div className="bg-white border shadow-sm p-8 rounded-xl">
            <Lock className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Encryption</h3>
            <p className="text-gray-700">AES-256 at rest, TLS 1.2+ in transit.</p>
          </div>

          <div className="bg-white border shadow-sm p-8 rounded-xl">
            <Server className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Environment Isolation</h3>
            <p className="text-gray-700">
              Multi-tenant Firestore security rules enforce strict organization boundaries.
            </p>
          </div>

          <div className="bg-white border shadow-sm p-8 rounded-xl">
            <Workflow className="h-10 w-10 text-blue-600 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Audit Logs</h3>
            <p className="text-gray-700">
              All data access, incident actions, and dispute operations are fully logged.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION: PLATFORM RELIABILITY */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold mb-10 text-center">Built for Scale & Reliability</h2>

          <div className="grid md:grid-cols-2 gap-12">

            <div>
              <h3 className="text-2xl font-semibold mb-4">DevOps & Infrastructure</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Global CDN routing</li>
                <li>Automated failover</li>
                <li>Multi-zone Firestore redundancy</li>
                <li>Zero-downtime deploys</li>
                <li>Serverless autoscaling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Consistency Model</h3>
              <p className="text-gray-700">
                Real-time Firestore syncing keeps all locations, admins, and teams aligned with
                consistent data across devices and locations.
              </p>
              <p className="text-gray-700 mt-4">
                Enterprise SLAs available for high-volume operators.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
        <h2 className="text-4xl font-bold mb-6">See RentFAX Technology in Action</h2>
        <p className="max-w-xl mx-auto text-blue-100 mb-10">
          Experience the platform that transforms renter verification and rental risk management.
        </p>

        <a href="/demo">
          <button className="bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg hover:bg-blue-100">
            Request Demo
          </button>
        </a>
      </section>

    </main>
  );
}
