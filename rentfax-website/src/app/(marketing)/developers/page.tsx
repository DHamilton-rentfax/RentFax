import { Metadata } from "next";
import { Code2, Layers, Server, ShieldCheck, GitBranch, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Developers & API | RentFAX",
  description:
    "RentFAX offers modern REST APIs, webhooks, and integration tools for property management platforms, CRMs, and enterprise systems.",
};

export default function DevelopersPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-indigo-600 to-blue-700 text-white">
        <Code2 className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h1 className="text-5xl font-bold mb-4">RentFAX for Developers</h1>
        <p className="max-w-2xl mx-auto text-lg text-blue-100">
          A modern API powering rental intelligence, fraud detection, and risk scoring.
          Built for PMS systems, CRMs, and enterprise workflows.
        </p>
      </section>

      {/* FEATURES */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">

        <div className="p-8 border rounded-xl shadow-sm">
          <Server className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="font-semibold mb-2">Modern REST API</h3>
          <p className="text-sm text-gray-700">
            Submit incidents, verify identities, fetch reports, and manage companies programmatically.
          </p>
        </div>

        <div className="p-8 border rounded-xl shadow-sm">
          <Layers className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="font-semibold mb-2">Event Webhooks</h3>
          <p className="text-sm text-gray-700">
            Receive real-time updates when reports are submitted, disputes filed, or identity checks complete.
          </p>
        </div>

        <div className="p-8 border rounded-xl shadow-sm">
          <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="font-semibold mb-2">Secure OAuth Framework</h3>
          <p className="text-sm text-gray-700">
            Scoped access tokens and multi-tenant permission controls ensure safe, compliant app integrations.
          </p>
        </div>

      </section>

      {/* DOCS CTA */}
      <section className="py-24 text-center bg-slate-50 border-t">
        <p className="text-gray-600 mb-6">Explore the RentFAX Developer Documentation</p>
        <a
          href="/developers/docs"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Visit Developer Docs <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </section>

    </main>
  );
}
