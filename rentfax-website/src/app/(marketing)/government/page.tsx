import { Metadata } from "next";
import { Landmark, ShieldCheck, Users, FileSearch, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Government & Housing Authorities | RentFAX",
  description:
    "RentFAX supports public housing agencies, HUD partners, and government organizations with fair, transparent rental intelligence.",
};

export default function GovernmentPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
        <Landmark className="h-12 w-12 mx-auto mb-4 opacity-90" />
        <h1 className="text-5xl font-bold mb-4">Government & Housing Authorities</h1>
        <p className="max-w-3xl mx-auto text-lg text-blue-100">
          RentFAX provides transparent, equitable rental data tools designed to support
          HUD programs, public housing agencies, and state-level rental assistance teams.
        </p>
      </section>

      {/* BENEFITS */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        
        <div className="border rounded-xl p-8 shadow-sm bg-white">
          <Users className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Equitable Screening Tools</h3>
          <p className="text-gray-700 text-sm">
            Transparent data that avoids discrimination and supports fair housing standards.
          </p>
        </div>

        <div className="border rounded-xl p-8 shadow-sm bg-white">
          <FileSearch className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Verified Incident Records</h3>
          <p className="text-gray-700 text-sm">
            Access renter verification outcomes, dispute logs, and identity consistency checks.
          </p>
        </div>

        <div className="border rounded-xl p-8 shadow-sm bg-white">
          <ShieldCheck className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Compliance-Ready Reporting</h3>
          <p className="text-gray-700 text-sm">
            Audit logs, evidence trails, and standardized documentation support oversight and program audits.
          </p>
        </div>

      </section>

      {/* CTA */}
      <section className="py-24 text-center bg-slate-50 border-t">
        <a
          href="/contact"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          Contact Government Partnerships <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </section>

    </main>
  );
}
