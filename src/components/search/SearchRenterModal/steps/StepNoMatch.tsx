"use client";

import { ArrowLeft, Users } from "lucide-react";

export default function StepNoMatch({
  setActiveStep,
  onClose,
}: {
  setActiveStep: (s: 1) => void;
  onClose: () => void;
}) {
  return (
    <div className="space-y-6">
      <button
        onClick={() => setActiveStep(1)}
        className="text-xs text-gray-600 hover:text-gray-900 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <div className="flex items-start gap-3 text-sm">
        <Users className="h-4 w-4 mt-0.5" />
        <div>
          <p className="font-semibold">No renter match found</p>
          <p className="text-xs text-gray-600 mt-1">
            Try adding email, phone, or license number for better accuracy.
          </p>
        </div>
      </div>

      <button
        onClick={() => setActiveStep(1)}
        className="w-full rounded-full border border-gray-900 px-3 py-2 text-xs font-semibold hover:bg-gray-900 hover:text-white"
      >
        Try again
      </button>

      <button
        onClick={onClose}
        className="w-full rounded-full border border-gray-300 px-3 py-2 text-xs font-semibold hover:bg-gray-100"
      >
        Close
      </button>
    </div>
  );
}
