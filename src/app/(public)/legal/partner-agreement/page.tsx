"use client";
import Link from "next/link";

export default function PartnerAgreementPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">
        RentFAX Partner Agreement (MOU)
      </h1>
      <p className="text-slate-700 mb-4">
        This Memorandum of Understanding (“MOU”) defines the collaboration
        framework between RentFAX, Inc. (“RentFAX”) and Partners (collections,
        legal, and insurance organizations). The purpose is to securely enable
        data exchange, referral revenue, and compliance alignment.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Key Partnership Terms</h2>
      <ul className="list-disc ml-6 text-slate-700 space-y-2">
        <li>Revenue sharing on successful referrals and verified cases.</li>
        <li>Data protection under GDPR, CCPA, and RentFAX’s DPA.</li>
        <li>Access to the Partner API Gateway with secure authentication.</li>
        <li>12-month renewable term with 30-day termination notice.</li>
      </ul>

      <p className="mt-6 text-slate-600">
        For full agreement details or to review our Data Processing Addendum,
        please contact{" "}
        <Link
          href="mailto:partners@rentfax.io"
          className="text-amber-600 underline"
        >
          partners@rentfax.io
        </Link>
        .
      </p>

      <p className="mt-8">
        <Link
          href="/partners"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium"
        >
          Apply to Become a Partner
        </Link>
      </p>
    </div>
  );
}
