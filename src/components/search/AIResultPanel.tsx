"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertTriangle,
  FileCheck2,
  ShieldCheck,
  Search,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";


export default function AIResultPanel({
  result,
  onViewFullReport,
  onNewSearch,
}: {
  result: any;
  onViewFullReport: (renterId: string) => void;
  onNewSearch: () => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!result)
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-gray-400">
        <Search className="w-6 h-6 mr-2" />
        Waiting for search…
      </div>
    );

  const {
    status,
    matchConfidence,
    identityScore,
    renterId,
    publicProfile,
    matchSource,
    fraudSignals,
  } = result;

  const isFound = status === "FOUND_IN_RENTFAX" || matchSource === "RENTFAX";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="ai-result"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A2540]">
            Match Result
          </h2>
          <button
            onClick={onNewSearch}
            className="text-[#1A2540] text-sm hover:underline"
          >
            New Search
          </button>
        </div>

        {/* Match Confidence */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm mb-1">
            Identity Match Confidence
          </p>
          <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-[#1A2540] transition-all"
              style={{ width: `${matchConfidence}%` }}
            />
          </div>
          <p className="text-sm mt-1 font-medium text-gray-700">
            {matchConfidence}% match
          </p>
        </div>

        {/* Fraud Score */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm mb-1">AI Fraud Risk Score</p>
          <div className="flex items-center gap-3">
            <ShieldCheck
              className={`w-6 h-6 ${
                identityScore < 30
                  ? "text-green-500"
                  : identityScore < 60
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            />
            <span
              className={`font-semibold ${
                identityScore < 30
                  ? "text-green-600"
                  : identityScore < 60
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {identityScore}/100 risk
            </span>
          </div>
        </div>

        {/* If found in RentFAX */}
        {isFound && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 mb-6">
            <p className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4" />
              Matching profile found in RentFAX
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Incidents, disputes, history, and renter profile data available.
            </p>
          </div>
        )}

        {/* Public Profile Summary */}
        {publicProfile && (
          <div className="mb-6">
            <p className="text-gray-500 text-sm mb-1">Public Records Match</p>
            <p className="font-medium text-gray-800">
              {publicProfile.fullName || "No name found"}
            </p>
            <p className="text-gray-600 text-sm">
              {publicProfile.address || "No address found"}
            </p>
          </div>
        )}

        {/* Fraud Signals */}
        {fraudSignals?.length > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded-xl">
            <p className="font-semibold text-red-700 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Fraud Signals Detected
            </p>

            <ul className="text-sm text-red-700 list-disc ml-5 space-y-1">
              {fraudSignals.map((fs: any, idx: number) => (
                <li key={idx}>{fs}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => {
              setLoading(true);
              onViewFullReport(renterId);
            }}
            disabled={!isFound || loading}
            className={`
              px-5 py-3 rounded-lg text-white font-semibold flex items-center gap-2
              ${
                isFound
                  ? "bg-[#1A2540] hover:bg-[#2A3660]"
                  : "bg-gray-400 cursor-not-allowed"
              }
            `}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                View Full Report <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            onClick={onNewSearch}
            className="text-gray-700 hover:text-black text-sm"
          >
            New Search
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
