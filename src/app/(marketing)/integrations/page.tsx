import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations | RentFAX",
  description:
    "Explore RentFAX integrations with identity verification, payments, and data partners.",
};

export default function IntegrationsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold text-[#1A2540] mb-4">
        Integrations
      </h1>

      <p className="text-gray-600 mb-10 max-w-2xl">
        RentFAX integrates with best-in-class partners for identity verification,
        payments, analytics, and risk intelligence.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Firebase</h3>
          <p className="text-sm text-gray-600">
            Secure authentication, Firestore data storage, and audit logging.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">Stripe</h3>
          <p className="text-sm text-gray-600">
            Subscriptions, usage-based billing, and payments.
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold mb-2">AI & Risk Engines</h3>
          <p className="text-sm text-gray-600">
            Fraud detection, renter scoring, and automated insights.
          </p>
        </div>
      </div>
    </main>
  );
}
