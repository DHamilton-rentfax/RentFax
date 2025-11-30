"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

// In a real app, you would fetch these partners from your Firestore database
const DUMMY_PARTNERS = [
  { id: "agency_1", name: "Statewide Collections Inc.", type: "agency" },
  { id: "agency_2", name: "National Recovery", type: "agency" },
  { id: "legal_1", name: "Smith & Jones Law Firm", type: "legal" },
  { id: "legal_2", name: "Property Law Group", type: "legal" },
];

interface Props {
  reportId: string;
  isOpen: boolean;
  onClose: () => void;
  // This would come from your auth hook
  getAuthToken: () => Promise<string | null>;
}

export default function ReportAssignmentModal({ reportId, isOpen, onClose, getAuthToken }: Props) {
  const [assigneeType, setAssigneeType] = useState<"agency" | "legal" | "">("");
  const [assigneeId, setAssigneeId] = useState("");
  const [partners, setPartners] = useState<{ id: string; name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Here you would fetch your partners from Firestore, e.g., from a "partners" collection
    setPartners(DUMMY_PARTNERS);
  }, []);

  const handleAssign = async () => {
    if (!assigneeId || !assigneeType) {
      return toast.error("Please select an assignment type and a specific partner.");
    }
    setLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const res = await fetch("/api/reports/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId,
          assigneeId,
          assigneeType,
        }),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        throw new Error(responseBody.error || "Failed to assign report.");
      }

      toast.success("Report successfully assigned!");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(`Assignment failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredPartners = partners.filter((p) => p.type === assigneeType);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold mb-4 text-[#1A2540]">Assign Report</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Assignment Type</label>
            <select
              value={assigneeType}
              onChange={(e) => {
                setAssigneeType(e.target.value as any);
                setAssigneeId("");
              }}
              className="border p-2 rounded-md w-full bg-gray-50"
            >
              <option value="">Select Type...</option>
              <option value="agency">Agency (Collections)</option>
              <option value="legal">Legal Firm</option>
            </select>
          </div>
          {assigneeType && (
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Select Partner</label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="border p-2 rounded-md w-full bg-gray-50"
              >
                <option value="">Select a partner...</option>
                {filteredPartners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 font-semibold rounded-md hover:bg-gray-100">Cancel</button>
          <button
            onClick={handleAssign}
            disabled={loading || !assigneeId}
            className="bg-[#1A2540] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#2d3c66] transition disabled:opacity-50"
          >
            {loading ? "Assigning..." : "Confirm Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
