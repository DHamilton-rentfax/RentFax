"use client";

import { Scale, FileText, ShieldCheck, Users, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CompliancePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-gray-900">
      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-slate-900 via-slate-950 to-black text-white">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Compliance & Fair Use
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-sm md:text-base text-slate-300">
          RentFAX is built with fairness, transparency, and regulatory alignment
          at its core — for both landlords and renters.
        </p>
      </section>

      {/* FRAMEWORKS */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-slate-900">
          Our Compliance Philosophy
        </h2>
        <p className="text-sm md:text-base text-gray-700 mb-8">
          While laws vary by region, RentFAX is designed with principles similar
          to FCRA, HUD guidance, and modern privacy regulations in mind:
          fairness, accuracy, accountability, and consumer rights.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-center">
            <Scale className="h-9 w-9 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">Fairness</h3>
            <p className="text-xs text-gray-700">
              We provide renters with access to their information and a way to
              dispute or correct it.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-center">
            <FileText className="h-9 w-9 text-sky-700 mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">Accuracy</h3>
            <p className="text-xs text-gray-700">
              Reports are based on documented incidents, not hearsay. Disputes
              and corrections are tracked.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm text-center">
            <ShieldCheck className="h-9 w-9 text-indigo-700 mx-auto mb-3" />
            <h3 className="font-semibold text-sm mb-1">Accountability</h3>
            <p className="text-xs text-gray-700">
              Audit logs, permissions, and company policies help ensure proper
              use of RentFAX data.
            </p>
          </div>
        </div>
      </section>

      {/* RENTER RIGHTS */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Renter Rights</h2>
            <p className="text-sm md:text-base text-gray-700 mb-3">
              Renters are not invisible in RentFAX. Our platform is intentionally
              designed so that someone being evaluated can understand and
              interact with their record.
            </p>
            <ul className="text-xs text-gray-700 space-y-2">
              <li>• Ability to verify identity and claim their profile.</li>
              <li>• Ability to view incidents and dispute records.</li>
              <li>• Ability to submit evidence or context for review.</li>
              <li>• Ability to request corrections to inaccurate data.</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-white p-6 shadow-sm flex gap-4">
            <Users className="h-8 w-8 text-blue-700 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold mb-1">
                Designed for Fair Outcomes
              </h3>
              <p className="text-xs text-gray-700">
                We encourage landlords to consider the full story: incidents,
                disputes, resolutions, and positive history — not just a single
                red flag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESPONSIBLE USE */}
      <section className="py-20 bg-white border-t">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-semibold mb-3">Responsible Use</h2>
          <p className="text-sm md:text-base text-gray-700 mb-3">
            RentFAX is a decision support tool. It is not a replacement for
            legal advice, local regulations, or landlord judgement.
          </p>
          <ul className="text-xs text-gray-700 space-y-2 mb-6">
            <li>
              • Landlords should follow all applicable laws in their region
              regarding tenant screening and adverse actions.
            </li>
            <li>
              • RentFAX data should never be used to discriminate based on
              protected characteristics.
            </li>
            <li>
              • Regulatory and industry feedback helps shape our roadmap and
              safeguards over time.
            </li>
          </ul>

          <div className="rounded-2xl border bg-slate-50 p-6 shadow-sm flex gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold mb-1">Important Note</h3>
              <p className="text-xs text-gray-700">
                This page is not legal advice. Organizations using RentFAX should
                consult counsel to ensure their screening processes comply with
                local, state/province, and federal law.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-black text-white border-t text-center">
        <h2 className="text-3xl font-bold mb-4">
          Compliance questions or policy reviews?
        </h2>
        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-8">
          Our team can collaborate with your legal, compliance, or housing policy
          teams to ensure RentFAX is used appropriately within your workflows.
        </p>
        <Link href="/contact">
          <Button size="lg" className="bg-emerald-400 text-black hover:bg-emerald-300">
            Contact Us About Compliance
          </Button>
        </Link>
      </section>
    </main>
  );
}
