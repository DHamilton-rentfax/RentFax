import { Metadata } from "next";
import {
  ShieldCheck,
  Lock,
  FileText,
  KeyRound,
  Server,
  Trash2,
  Repeat,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Data Protection | RentFAX",
  description:
    "Learn how RentFAX protects identity data, incident history, and rental intelligence through secure storage, retention policies, and access controls.",
};

export default function DataProtectionPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="py-24 px-6 text-center bg-gradient-to-b from-slate-50 to-white border-b">
        <ShieldCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
        <h1 className="text-5xl font-bold text-[#1A2540] mb-6">Data Protection</h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-600">
          RentFAX is committed to protecting identity data, rental histories, and incident
          documentation through strict security, governance, and retention standards.
        </p>
      </section>

      {/* DATA MINIMIZATION */}
      <section className="py-20 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">

        <div>
          <h2 className="text-2xl font-bold mb-4">Data Minimization</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            RentFAX collects only the data necessary to perform risk analysis, identity
            consistency checks, incident documentation, and dispute workflows.
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            No marketing data harvesting. No unrelated profiling.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-8 shadow-sm">
          <KeyRound className="h-10 w-10 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Access Control Framework</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            Access to renter data is limited strictly by user role and company permissions.
            Only those who need access to perform rental decisions or dispute handling may view records.
          </p>
        </div>

      </section>

      {/* STORAGE & RETENTION */}
      <section className="py-20 bg-slate-50 border-t">
        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">Data Storage & Retention</h2>

          <ul className="space-y-6 text-gray-700 text-sm leading-relaxed">
            <li className="flex gap-4">
              <Server className="h-6 w-6 text-blue-600 shrink-0" />
              <span>
                Renter incidents and dispute data are stored securely in Firestore
                with environment-level tenant isolation.
              </span>
            </li>

            <li className="flex gap-4">
              <FileText className="h-6 w-6 text-blue-600 shrink-0" />
              <span>
                Evidence files are stored in Firebase Storage with unique,
                time-limited access URLs and strict permission boundaries.
              </span>
            </li>

            <li className="flex gap-4">
              <Repeat className="h-6 w-6 text-blue-600 shrink-0" />
              <span>
                Retention periods vary by region and company policy but generally ensure
                that records remain available for legitimate business needs.
              </span>
            </li>

            <li className="flex gap-4">
              <Trash2 className="h-6 w-6 text-blue-600 shrink-0" />
              <span>
                Permanent deletion occurs when legally required, when a company removes
                internal data, or when renter requests meet applicable standards.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* RENTER RIGHTS */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4">Renter Access & Rights</h2>

        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          Renters may request:
        </p>

        <ul className="list-disc pl-5 text-gray-700 text-sm space-y-2">
          <li>Visibility into incidents filed about them</li>
          <li>Correction of inaccuracies</li>
          <li>Submission of disputes and evidence</li>
          <li>Deletion of information that no longer meets legitimate use criteria</li>
        </ul>

        <p className="text-gray-700 text-xs mt-4">
          RentFAX verifies these requests to prevent fraudulent or malicious submissions.
        </p>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-slate-50 border-t">
        <a
          href="/security"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          View Security Practices
        </a>
      </section>

    </main>
  );
}
