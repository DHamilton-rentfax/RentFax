import type { Metadata } from "next";

export const metadata = {
  title: "System Audits & Oversight | RentFAX",
  description:
    "How RentFAX uses internal audits and oversight to ensure integrity, security, and compliance.",
};

export default function AuditsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-800">
            Audits
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            System Audits & Oversight
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            RentFAX maintains transparent audit logs, access checks, and internal oversight for sensitive actions across the system.
          </p>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
          
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Internal Audits</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Regular access log reviews</li>
              <li>• Sensitive action oversight</li>
              <li>• Data integrity checks</li>
              <li>• Spot-analysis of disputes and incidents</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Oversight & Governance
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Super Admin controls</li>
              <li>• Multi-level decision visibility</li>
              <li>• Periodic policy reviews</li>
              <li>• Transparent record lifecycles</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
