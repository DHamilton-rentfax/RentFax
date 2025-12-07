"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function VerificationReviewModal({
  id,
  open,
  onClose,
  onApproved,
  onRejected,
}: {
  id: string | null;
  open: boolean;
  onClose: () => void;
  onApproved: () => void;
  onRejected: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);
  const [notes, setNotes] = useState("");

  async function load() {
    if (!id) return;

    try {
      setLoading(true);
      const res = await fetch("/api/admin/verifications/get", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setItem(json.item);
      setNotes(json.item.adminNotes || "");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
  }, [open]);

  if (!open) return null;

  const approve = async () => {
    try {
      const res = await fetch("/api/admin/verifications/update", {
        method: "POST",
        body: JSON.stringify({ id, status: "approved", adminNotes: notes }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      onApproved();
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const reject = async () => {
    try {
      const res = await fetch("/api/admin/verifications/update", {
        method: "POST",
        body: JSON.stringify({ id, status: "rejected", adminNotes: notes }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      onRejected();
      onClose();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto">

        {/* Close */}
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-black">
          <X className="h-5 w-5" />
        </button>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-gray-700" />
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-2">
              Verification Review
            </h2>
            <p className="text-gray-600 mb-6">
              Review the submitted identity documents and approve or reject.
            </p>

            {/* Images */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="font-medium text-sm mb-1">Front ID</p>
                <img
                  src={item.frontImageUrl}
                  className="rounded-lg border"
                />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Back ID</p>
                <img
                  src={item.backImageUrl}
                  className="rounded-lg border"
                />
              </div>
              <div>
                <p className="font-medium text-sm mb-1">Selfie</p>
                <img
                  src={item.selfieUrl}
                  className="rounded-lg border"
                />
              </div>
            </div>

            {/* OCR + AI */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg border bg-gray-50">
                <p className="text-sm font-semibold mb-2">ID OCR Details</p>
                <p><strong>Name:</strong> {item.ocr?.name ?? "—"}</p>
                <p><strong>DOB:</strong> {item.ocr?.dob ?? "—"}</p>
                <p><strong>ID Number:</strong> {item.ocr?.idNumber ?? "—"}</p>
              </div>

              <div className="p-4 rounded-lg border bg-gray-50">
                <p className="text-sm font-semibold mb-2">AI Match Results</p>
                <p><strong>Identity Score:</strong> {item.ai?.identityScore ?? "—"}%</p>
                <p><strong>Face Similarity:</strong> {item.ai?.faceSimilarity ?? "—"}%</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="text-sm font-medium">Admin Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm mt-1"
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={reject}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-full"
              >
                Reject
              </button>
              <button
                onClick={approve}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-full"
              >
                Approve
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
