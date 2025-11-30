"use client";

import { motion } from "framer-motion";
import { X, ShieldCheck, CreditCard } from "lucide-react";

import type { SearchPayload, SearchResult } from "../types";

const BRAND_GOLD = "#D9A334";

interface Props {
  open: boolean;
  payload: SearchPayload | null;
  result: SearchResult | null;
  onBack: () => void;
  onClose: () => void;
}

export default function SearchStep3({
  open,
  payload,
  result,
  onBack,
  onClose,
}: Props) {
  if (!open) return null;

  async function payIdentityCheck() {
    // Stripe checkout
    const res = await fetch("/api/purchase/identity-check", {
      method: "POST",
      body: JSON.stringify({ renter: payload }),
      headers: { "Content-Type": "application/json" },
    });

    const { url } = await res.json();
    window.location.href = url;
  }

  async function payFullReport() {
    const res = await fetch("/api/purchase/full-report", {
      method: "POST",
      body: JSON.stringify({ renter: payload }),
      headers: { "Content-Type": "application/json" },
    });

    const { url } = await res.json();
    window.location.href = url;
  }

  function requestSelfVerify() {
    // open a link to send verification to renter
    window.open(
      `/verify?renterEmail=${payload?.email ?? ""}`,
      "_blank"
    );
  }

  return (
    <motion.div
      className="flex h-full w-full max-w-lg flex-col bg-white shadow-2xl"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <h2 className="text-2xl font-semibold">Unlock Full Report</h2>
        <button onClick={onClose}>
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6 overflow-y-auto">

        {/* Option A — Always Paid: $4.99 */}
        <div className="border rounded-lg p-5 bg-gray-50 space-y-3">
          <p className="font-semibold">Identity Check</p>
          <p className="text-sm text-gray-600">
            Basic identity validation. Required for all searches.
          </p>
          <button
            onClick={payIdentityCheck}
            className="w-full py-2.5 rounded-full text-white font-medium"
            style={{ background: BRAND_GOLD }}
          >
            Pay $4.99 Identity Check
          </button>
        </div>

        {/* Option B — Member Unlock */}
        <div className="border rounded-lg p-5 bg-gray-50 space-y-3">
          <p className="font-semibold">Membership Credit Unlock</p>
          <p className="text-sm text-gray-600">
            If you have an active paid membership, you can use 1 credit to unlock the full report.
          </p>
          <button
            onClick={payFullReport}
            className="w-full py-2.5 rounded-full text-white font-medium"
            style={{ background: "#1A1A1A" }}
          >
            Use 1 Credit (Full Report)
          </button>
        </div>

        {/* Option C — Renter Self-Verification */}
        <div className="border rounded-lg p-5 bg-gray-50 space-y-3">
          <p className="font-semibold">Renter Self Verification</p>
          <p className="text-sm text-gray-600">
            Send the renter a verification request (ID photo + selfie match + license number).
            Verified renters reduce fraud risk and boost match accuracy.
          </p>

          <button
            onClick={requestSelfVerify}
            className="w-full py-2.5 rounded-full text-gray-900 font-medium bg-gray-200"
          >
            Send Verification Request
          </button>
        </div>

        {/* Option D — One-Time Full Report */}
        <div className="border rounded-lg p-5 bg-gray-50 space-y-3">
          <p className="font-semibold">Full Report (One-Time)</p>
          <p className="text-sm text-gray-600">
            Includes incidents, disputes, risk factors, fraud indicators and more.
          </p>

          <button
            onClick={payFullReport}
            className="w-full py-2.5 rounded-full text-white font-medium"
            style={{ background: BRAND_GOLD }}
          >
            Pay $20 Full Report
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4">
        <button
          onClick={onBack}
          className="w-full py-2.5 rounded-full bg-gray-100 text-gray-700"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
