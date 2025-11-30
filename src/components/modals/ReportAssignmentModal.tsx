"use client";

import { useState } from "react";
import { toast } from "sonner";

interface Props {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  existingAgencyId?: string | null;
  existingLegalId?: string | null;
}

export default function ReportAssignmentModal({
  reportId,
  isOpen,
  onClose,
  existingAgencyId,
  existingLegalId,
}: Props) {
  const [selectedType, setSelectedType] = useState<"agency" | "legal">("agency");
  const [targetId, setTargetId] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) {
      toast.error("Please enter a valid partner ID (UID or Email).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reports/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId,
          assignType: selectedType,
          targetId: targetId.trim(),
        }),
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success(
        selectedType === "agency"
          ? "Report successfully assigned to agency."
          : "Report successfully assigned to legal team."
      );
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to assign report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#1A2540] mb-2">Assign Report</h2>
        <p className="text-gray-600 text-sm mb-4">
          Assign this report to an agency or legal team to handle collections or legal action.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="agency"
                checked={selectedType === "agency"}
                onChange={() => setSelectedType("agency")}
              />
              Agency
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="type"
                value="legal"
                checked={selectedType === "legal"}
                onChange={() => setSelectedType("legal")}
              />
              Legal
            </label>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              {selectedType === "agency" ? "Agency User ID or Email" : "Legal Team User ID or Email"}
            </label>
            <input
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="e.g. partneragency@example.com"
              className="border p-2 rounded-md w-full"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#1A2540] text-white font-semibold rounded-md hover:bg-[#2d3c66]"
            >
              {loading ? "Assigning..." : "Assign"}
            </button>
          </div>
        </form>

        {(existingAgencyId || existingLegalId) && (
          <div className="mt-4 text-sm text-gray-500 border-t pt-3">
            <p>
              Current Agency:{" "}
              {existingAgencyId ? (
                <strong>{existingAgencyId}</strong>
              ) : (
                <em>None assigned</em>
              )}
            </p>
            <p>
              Current Legal:{" "}
              {existingLegalId ? (
                <strong>{existingLegalId}</strong>
              ) : (
                <em>None assigned</em>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}