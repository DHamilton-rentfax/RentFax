"use client";
import { useState } from "react";

export default function DisputeDetails({ dispute, onClose }: any) {
  const [status, setStatus] = useState(dispute.status);
  const [note, setNote] = useState(dispute.adminNote || "");
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const res = await fetch("/api/disputes/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dispute }),
    });
    const data = await res.json();
    setAiResult(data);
    setAnalyzing(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    await fetch("/api/disputes/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: dispute.id, status, adminNote: note }),
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-5 shadow-lg">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">
          Dispute Details
        </h2>
        <p className="text-sm text-gray-600 mb-3">{dispute.message}</p>

        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md p-1.5 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <label className="block text-sm font-medium text-gray-700">
          Admin Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border rounded-md p-2 w-full text-sm resize-none"
          rows={3}
        />

        {/* AI Assistance Section */}
        <div className="mt-4 border-t pt-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            RentFAX AI Assistant
          </h3>
          {!aiResult ? (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="text-sm text-blue-600 hover:underline"
            >
              {analyzing ? "Analyzing…" : "Run AI Analysis"}
            </button>
          ) : (
            <div className="bg-gray-50 border rounded-md p-2 mt-1">
              <p className="text-xs text-gray-700">{aiResult.aiSummary}</p>
              <p className="text-xs mt-1 text-gray-500">
                Suggested Status:
                <span className="font-semibold text-emerald-700">
                  {aiResult.suggestedStatus}
                </span>
              </p>
              <button
                onClick={() => setStatus(aiResult.suggestedStatus)}
                className="mt-2 text-xs text-emerald-700 hover:underline"
              >
                Apply Suggested Status
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button onClick={onClose} className="text-gray-600 text-sm">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="bg-emerald-600 text-white text-sm px-4 py-1.5 rounded-md"
          >
            {saving ? "Saving…" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
