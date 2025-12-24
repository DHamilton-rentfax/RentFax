"use client";

import { ArrowLeft } from "lucide-react";

/* -------------------------------------------------------------------------------------------------
 * SAMPLE REPORT MOBILE VIEW (IN-MODAL)
 * ------------------------------------------------------------------------------------------------*/
export default function SampleReportMobile({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        type="button"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </button>

      <div className="border rounded-xl bg-white shadow-sm px-3 py-4 text-gray-800">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-xl font-bold">RentFAX — Renter History Report</h1>
          <p className="text-[11px] text-gray-500 mt-1">
            Sample report • Demonstration only
          </p>
        </div>

        {/* RISK SCORE SECTION */}
        <div className="grid grid-cols-1 gap-3 mb-4">
          {/* Risk Score */}
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs font-semibold text-gray-600">
              Renter Risk Score
            </p>
            <p className="text-2xl font-bold text-green-700 mt-1">732</p>
            <span className="inline-block mt-2 text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              LOW RISK
            </span>
          </div>

          {/* Confidence Score */}
          <div className="border rounded-lg p-3 bg-white shadow-sm">
            <p className="text-xs font-semibold text-gray-600">
              Identity Confidence Score
            </p>
            <p className="text-2xl font-bold text-blue-700 mt-1">815</p>
            <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              HIGH MATCH
            </span>
          </div>
        </div>

        {/* RENTER DETAILS */}
        <div className="border rounded-lg p-3 bg-white shadow-sm mb-4">
          <h2 className="text-sm font-semibold mb-2">Renter Details</h2>
          <p className="text-xs">
            <b>Name:</b> Johnathan Doe
          </p>
          <p className="text-xs">
            <b>Email:</b> john.doe@mail.com
          </p>
          <p className="text-xs">
            <b>Phone:</b> (555) 555-1234
          </p>
          <p className="text-xs">
            <b>Address:</b> 123 Main St, Nashville TN
          </p>
          <p className="text-xs">
            <b>License:</b> XXXXXXXXX
          </p>
        </div>

        {/* INCIDENT HISTORY */}
        <div className="mb-4">
          <h2 className="text-sm font-semibold mb-3">Incident History</h2>

          {/* INCIDENT 1 */}
          <div className="border rounded-lg p-3 bg-white shadow-sm mb-3">
            <div className="flex justify-between mb-1.5">
              <span className="text-xs font-semibold">Damage Claim</span>
              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                RESOLVED
              </span>
            </div>
            <p className="text-xs">
              <b>Date:</b> Aug 2, 2024
            </p>
            <p className="text-xs">
              <b>Company:</b> Elite Rentals
            </p>
            <p className="text-xs">
              <b>Summary:</b> Minor door damage. Paid in full.
            </p>
            <p className="text-xs">
              <b>Amount:</b> $650
            </p>
          </div>

          {/* DISPUTE */}
          <div className="border rounded-lg p-3 bg-white shadow-sm mb-3">
            <span className="text-xs font-semibold">Dispute — Resolved</span>
            <p className="text-xs">
              <b>Filed:</b> Aug 5, 2024
            </p>
            <p className="text-xs">
              <b>Statement:</b> “Damage occurred in a parking lot.”
            </p>
            <p className="text-xs">
              <b>Outcome:</b> Balance reduced; renter paid remaining.
            </p>
          </div>
        </div>

        {/* IDENTITY VERIFICATION */}
        <div className="border rounded-lg p-3 bg-white shadow-sm mb-4">
          <h2 className="text-sm font-semibold mb-2">Identity Verification</h2>
          <p className="text-xs">
            <b>Confidence Score:</b> 815 (High)
          </p>
          <ul className="list-disc ml-5 text-[11px] mt-1.5 space-y-0.5">
            <li>Name match</li>
            <li>Address match</li>
            <li>Phone match</li>
            <li>Email age verified</li>
            <li>ID/license validated</li>
          </ul>
        </div>

        {/* AI SUMMARY */}
        <div className="border rounded-lg p-3 bg-white shadow-sm mb-4">
          <h2 className="text-sm font-semibold mb-2">AI Summary</h2>
          <p className="text-xs text-gray-700">
            John Doe demonstrates low renter risk with strong historical behavior. No
            unpaid balances, timely returns, and positive dispute resolution history.
            Ranked in the top 20% for reliability among comparable renters.
          </p>
        </div>

        {/* BADGES */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">
            VERIFIED IDENTITY
          </span>
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px]">
            PAID IN FULL
          </span>
          <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-[10px]">
            NO FRAUD INDICATORS
          </span>
          <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-[10px]">
            GOOD HISTORY
          </span>
        </div>

        {/* FOOTER */}
        <p className="text-center text-[10px] text-gray-500">
          © 2025 RentFAX • Sample Report • Not for official decision-making
        </p>
      </div>
    </div>
  );
}