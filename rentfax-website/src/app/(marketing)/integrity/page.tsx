import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrity & Fairness | RentFAX",
  description:
    "Learn how RentFAX ensures fairness, accuracy, and integrity throughout the entire reporting and risk scoring process.",
};

export default function IntegrityPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-green-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-green-200 px-3 py-1 text-xs font-medium text-green-900">
            Fairness & Integrity
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            Our Commitment to Fairness & Integrity
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            RentFAX balances landlord safety with renter fairness. No renter is
            penalized without evidence, verification, and the opportunity to
            dispute.
          </p>
        </div>
      </section>

      <section className="">
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              How We Protect Renters
            </h2>
            <ul className="mt-4 text-sm text-gray-700 space-y-2">
              <li>• Required evidence for every incident</li>
              <li>• Transparency into every record involving the renter</li>
              <li>• Opportunity to dispute and submit evidence</li>
              <li>• Human review of dispute outcomes</li>
              <li>• Removal of invalid or malicious reports</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              How We Protect Landlords
            </h2>
            <ul className="mt-4 text-sm text-gray-700 space-y-2">
              <li>• Identity verification consistency checks</li>
              <li>• Fraud signal detection</li>
              <li>• Behavioral pattern analysis</li>
              <li>• Verified incident and dispute timelines</li>
              <li>• Reliable risk signals for decision-making</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
