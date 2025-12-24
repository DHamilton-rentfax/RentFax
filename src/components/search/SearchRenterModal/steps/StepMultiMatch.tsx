"use client";

import { ArrowLeft, AlertTriangle } from "lucide-react";
import type { SearchResult } from "../SearchRenterModal";

type Props = {
  result: SearchResult | null;
  setActiveStep: (s: 1 | 2 | 3 | "multi" | "noMatch") => void;
};

export default function StepMultiMatch({ result, setActiveStep }: Props) {
  if (!result || !Array.isArray(result.candidates)) {
    return (
      <div className="space-y-4 text-sm text-gray-700">
        <p>We couldn’t confidently identify this renter.</p>
        <button
          onClick={() => setActiveStep(1)}
          className="rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white"
          type="button"
        >
          Return to search
        </button>
      </div>
    );
  }

  const candidates = result.candidates;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => setActiveStep(1)}
        className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
        type="button"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </button>

      {/* Header */}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900">
          Multiple possible matches
        </h3>
        <p className="text-sm text-gray-600">
          We found more than one renter that closely matches your search.
        </p>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 text-sm text-gray-700">
        <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-600" />
        <p>
          To protect against fraud, identity verification is disabled until the
          renter can be uniquely identified.
        </p>
      </div>

      {/* Candidate list */}
      <div className="space-y-3 border-t border-dashed pt-4">
        {candidates.length === 0 ? (
          <p className="text-sm text-gray-600">
            No strong matches found. Please refine your search.
          </p>
        ) : (
          candidates.map((c, index) => (
            <div
              key={`${c.id ?? "candidate"}-${index}`}
              className="rounded-md border border-gray-200 p-3 text-sm space-y-0.5"
            >
              <p className="font-medium text-gray-900">
                {c.renter.fullName || "Unknown name"}
              </p>

              <p className="text-xs text-gray-600">
                Match confidence: {Math.round((c.similarity ?? 0) * 100)}%
              </p>

              <p className="text-xs text-gray-600">
                Email: {c.renter.email || "—"}
              </p>

              <p className="text-xs text-gray-600">
                Phone: {c.renter.phone || "—"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Action */}
      <button
        onClick={() => setActiveStep(1)}
        className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white"
        type="button"
      >
        Refine search
      </button>
    </div>
  );
}
