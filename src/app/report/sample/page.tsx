"use client";

import {
  CheckCircle,
  Shield,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function SampleRentfaxReport() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 text-gray-800">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold">RentFAX — Renter History Report</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sample report • Demonstration only
        </p>
      </div>

      {/* RISK SCORE SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

        {/* Risk Score */}
        <div className="border rounded-xl p-5 bg-white shadow">
          <p className="text-sm font-semibold text-gray-600">Renter Risk Score</p>
          <p className="text-4xl font-bold text-green-700 mt-1">732</p>
          <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            LOW RISK
          </span>
        </div>

        {/* Confidence Score */}
        <div className="border rounded-xl p-5 bg-white shadow">
          <p className="text-sm font-semibold text-gray-600">Identity Confidence Score</p>
          <p className="text-4xl font-bold text-blue-700 mt-1">815</p>
          <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            HIGH MATCH
          </span>
        </div>

      </div>

      {/* RENTER DETAILS */}
      <div className="border rounded-xl p-5 bg-white shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">Renter Details</h2>
        <p><b>Name:</b> Johnathan Doe</p>
        <p><b>Email:</b> john.doe@mail.com</p>
        <p><b>Phone:</b> (555) 555-1234</p>
        <p><b>Address:</b> 123 Main St, Nashville TN</p>
        <p><b>License:</b> XXXXXXXXX</p>
      </div>

      {/* INCIDENT TIMELINE */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Incident History</h2>

        {/* INCIDENT 1 */}
        <div className="border rounded-xl p-5 bg-white shadow mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Damage Claim</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              RESOLVED
            </span>
          </div>
          <p><b>Date:</b> Aug 2, 2024</p>
          <p><b>Company:</b> Elite Rentals</p>
          <p><b>Summary:</b> Minor door damage. Paid in full.</p>
          <p><b>Amount:</b> $650</p>
        </div>

        {/* DISPUTE */}
        <div className="border rounded-xl p-5 bg-white shadow mb-4">
          <span className="font-semibold">Dispute — Resolved</span>
          <p><b>Filed:</b> Aug 5, 2024</p>
          <p><b>Statement:</b> “Damage occurred in a parking lot.”</p>
          <p><b>Outcome:</b> Balance reduced; renter paid remaining.</p>
        </div>
      </div>

      {/* IDENTITY VERIFICATION */}
      <div className="border rounded-xl p-5 bg-white shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">Identity Verification</h2>
        <p><b>Confidence Score:</b> 815 (High)</p>
        <ul className="list-disc ml-6 text-sm mt-2">
          <li>Name match</li>
          <li>Address match</li>
          <li>Phone match</li>
          <li>Email age verified</li>
          <li>ID/license validated</li>
        </ul>
      </div>

      {/* AI SUMMARY */}
      <div className="border rounded-xl p-5 bg-white shadow mb-8">
        <h2 className="text-lg font-semibold mb-3">AI Summary</h2>
        <p className="text-sm text-gray-700">
          John Doe demonstrates low renter risk with strong historical behavior.
          No unpaid balances, timely returns, and positive dispute resolution history.
          Ranked in the top 20% for reliability among comparable renters.
        </p>
      </div>

      {/* BADGES */}
      <div className="flex gap-2 mb-10 flex-wrap">
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
          VERIFIED IDENTITY
        </span>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs">
          PAID IN FULL
        </span>
        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
          NO FRAUD INDICATORS
        </span>
        <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs">
          GOOD HISTORY
        </span>
      </div>

      {/* FOOTER */}
      <p className="text-center text-xs text-gray-500">
        © 2025 RentFAX • Sample Report • Not for official decision-making
      </p>
    </div>
  );
}