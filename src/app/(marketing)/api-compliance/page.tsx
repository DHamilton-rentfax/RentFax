import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Compliance & Integration Standards | RentFAX",
  description:
    "Policies and standards for API integrations, developer usage, and data protection requirements.",
};

export default function APICompliancePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-indigo-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-indigo-200 px-3 py-1 text-xs font-medium text-indigo-900">
            API Compliance
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            API Compliance & Integration Standards
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            RentFAX requires all integration partners to follow strict privacy,
            security, and data protection policies.
          </p>
        </div>
      </section>

      <section>
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Integration Requirements</h2>
            <ul className="mt-4 text-sm text-gray-700 space-y-2">
              <li>• Secure API key management</li>
              <li>• JWT-based authentication</li>
              <li>• No external sharing of renter PII</li>
              <li>• Strict rate-limit adherence</li>
              <li>• Fair Housing alignment in all usage patterns</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">Partner Responsibilities</h2>
            <ul className="mt-4 text-sm text-gray-700 space-y-2">
              <li>• Maintain secure servers and environments</li>
              <li>• Do not store sensitive RentFAX data unencrypted</li>
              <li>• Comply with deletion requests promptly</li>
              <li>• Follow all privacy and consent standards</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
