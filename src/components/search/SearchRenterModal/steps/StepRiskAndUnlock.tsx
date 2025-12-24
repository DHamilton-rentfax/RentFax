"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "../SearchRenterModal";
import { convertScore, scoreLabel, scoreColor } from "@/lib/risk/convertScore";

type StepKey = 1 | 2 | 3 | "multi" | "noMatch";

export default function StepRiskAndUnlock({
  result,
  isReloading,
  setActiveStep,
  handleFullReportCheckout,
  fullReportCheckoutLoading,
  setViewMode,
  onClose,
}: {
  result: SearchResult | null;
  isReloading: boolean;
  setActiveStep: (step: StepKey) => void;
  handleFullReportCheckout: () => void;
  fullReportCheckoutLoading: boolean;
  setViewMode: (mode: "search" | "sample") => void;
  onClose: () => void;
}) {
  const router = useRouter();

  if (!result || !result.preMatchedReportId) return null;

  const isUnlocked = result.unlocked === true;

  /* ---------------------------------- RELOADING STATE ---------------------------------- */
  if (isReloading) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <p className="mt-3 text-sm text-gray-600">Verifying purchase…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RISK SUMMARY */}
      {result.risk?.riskScore?.score !== undefined && (
        <div className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
          <p className="text-xs font-semibold text-gray-700">
            Renter Risk Score
          </p>

          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold">
              {convertScore(result.risk.riskScore.score, "CREDIT")}
            </p>

            <div
              className={`px-2 py-1 rounded-full text-[10px] font-medium ${scoreColor(
                result.risk.riskScore.score
              )}`}
            >
              {scoreLabel(result.risk.riskScore.score)}
            </div>
          </div>

          {result.risk?.confidenceScore?.score !== undefined && (
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-gray-700">
                Confidence Score
              </p>
              <p className="text-md font-medium text-gray-900">
                {convertScore(
                  result.risk.confidenceScore.score,
                  "CREDIT"
                )}
              </p>
              <p className="text-[11px] text-gray-600">
                Based on identity verification, behavioral patterns, and fraud
                signals.
              </p>
            </div>
          )}
        </div>
      )}

      {/* BACK */}
      <button
        onClick={() => setActiveStep(2)}
        className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        type="button"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      {/* INFO CARD */}
      <div className="border bg-gray-50 rounded-lg p-4 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Next Step</p>
          <p className="text-[11px] text-gray-500">Step 3 of 3</p>
        </div>

        {!isUnlocked ? (
          <p className="text-xs text-gray-600">
            This renter has a RentFAX history. Unlock the full report to view
            incidents, disputes, balances owed, and AI-generated insights.
          </p>
        ) : (
          <p className="text-xs text-gray-600">
            Full report unlocked. You can now review the renter’s full history.
          </p>
        )}
      </div>

      {/* ACTIONS */}
      {!isUnlocked ? (
        <>
          <button
            onClick={handleFullReportCheckout}
            disabled={fullReportCheckoutLoading}
            className="w-full rounded-full bg-gray-900 text-white px-3 py-2 text-xs font-semibold hover:bg-black disabled:opacity-50"
            type="button"
          >
            {fullReportCheckoutLoading && (
              <Loader2 className="inline h-3 w-3 mr-2 animate-spin" />
            )}
            Unlock Full Report ($20)
          </button>

          <p className="text-[11px] text-center text-gray-500">
            Includes incidents, disputes, balances owed, and AI-powered summary.
          </p>
        </>
      ) : (
        <button
          onClick={() =>
            router.push(`/report/${result.preMatchedReportId}`)
          }
          className="w-full rounded-full bg-green-600 text-white px-3 py-2 text-xs font-semibold hover:bg-green-700"
          type="button"
        >
          View Full Report
        </button>
      )}

      {/* SAMPLE REPORT */}
      <button
        onClick={() => setViewMode("sample")}
        className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100 mt-2"
        type="button"
      >
        View Sample Report (Demo)
      </button>

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
        type="button"
      >
        Close
      </button>
    </div>
  );
}
