"use client";

import { motion } from "framer-motion";
import { X, User, Mail, Phone, MapPin } from "lucide-react";

import type { SearchPayload, SearchResult } from "../types";

const BRAND_GOLD = "#D9A334";

interface Props {
  open: boolean;
  payload: SearchPayload | null;
  result: SearchResult | null;
  onBack: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function SearchStep2({
  open,
  payload,
  result,
  onBack,
  onNext,
  onClose,
}: Props) {
  if (!open) return null;

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
        <h2 className="text-2xl font-semibold">Match Found</h2>
        <button onClick={onClose}>
          <X className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-6 overflow-y-auto">

        {/* Identity Score */}
        <div className="rounded-lg border p-4 bg-gray-50 space-y-2">
          <p className="text-sm font-semibold text-gray-800">
            Identity Match Score
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {result?.identityScore ?? "—"}%
          </p>
        </div>

        {/* Fraud Score */}
        <div className="rounded-lg border p-4 bg-gray-50 space-y-2">
          <p className="text-sm font-semibold text-gray-800">
            Fraud Risk Score
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {result?.fraudScore ?? "—"}%
          </p>
        </div>

        {/* Public Profile */}
        <div className="rounded-lg border p-4 bg-gray-50 space-y-4">
          <p className="text-sm font-semibold text-gray-800">
            Public Profile
          </p>

          <div className="text-sm space-y-2">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4" /> {result?.publicProfile?.name ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {result?.publicProfile?.email ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {result?.publicProfile?.phone ?? "—"}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {result?.publicProfile?.address ?? "—"}
            </p>
          </div>
        </div>

        {/* Resolution */}
        <p className="text-xs text-gray-500">
          Continue to see full renter verification, incidents, history & past
          disputes.
        </p>
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-4 space-y-3">
        <button
          onClick={onNext}
          className="w-full rounded-full py-2.5 text-white font-semibold"
          style={{ background: BRAND_GOLD }}
        >
          Continue to Full Report
        </button>

        <button
          onClick={onBack}
          className="w-full rounded-full py-2.5 text-gray-700 font-medium bg-gray-100"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
}
