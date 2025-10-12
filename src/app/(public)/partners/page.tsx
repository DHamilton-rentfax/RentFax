"use client";
import Link from "next/link";

export default function PartnersPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Partner with RentFAX</h1>
      <p className="text-slate-700 mb-4">
        Join the RentFAX ecosystem and unlock new revenue streams. We partner with leading companies in the collections, legal, and insurance industries to provide a seamless experience for our users.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Why Partner with RentFAX?</h2>
      <ul className="list-disc ml-6 text-slate-700 space-y-2">
        <li>
          <b>Collections:</b> Receive qualified leads for debt recovery, backed by our verification reports.
        </li>
        <li>
          <b>Legal:</b> Get referrals for legal cases related to property damage, eviction, and more.
        </li>
        <li>
          <b>Insurance:</b> Integrate with our API to streamline insurance verification and underwriting.
        </li>
         <li>
          <b>API Integrations:</b> Connect your services to the RentFAX platform and reach a wider audience.
        </li>
      </ul>
      
      <h2 className="text-xl font-semibold mt-6 mb-2">Revenue Sharing</h2>
      <p className="text-slate-700 mb-4">
        We offer competitive revenue sharing agreements. Our standard terms are outlined in our Partner MOU, but we are open to discussing custom arrangements.
      </p>

      <p className="mt-8">
        <Link
          href="/legal/partner-agreement"
          className="text-amber-600 underline"
        >
          View our Partner Agreement
        </Link>
      </p>

      <p className="mt-8">
        <Link
          href="/apply-partner"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-md font-medium"
        >
          Apply to Become a Partner
        </Link>
      </p>
    </div>
  );
}