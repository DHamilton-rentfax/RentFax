"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CaseDetailPage() {
  const { caseId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/agency/case/${caseId}`);
      const json = await res.json();
      setData(json);
      setLoading(false);
    }
    load();
  }, [caseId]);

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    await fetch(`/api/agency/case/${caseId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newStatus }),
    });
    setUpdating(false);
    location.reload();
  }

  if (loading) return <p>Loading case…</p>;
  if (!data) return <p>Case not found</p>;

  const { case: caseData, report } = data;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Case #{caseData.caseId}</h2>

      {/* Case Info */}
      <div className="bg-white border rounded p-4">
        <p><strong>Status:</strong> {caseData.status}</p>
        <p><strong>Assigned Type:</strong> {caseData.assignedToType}</p>
      </div>

      {/* Report (READ-ONLY) */}
      <div className="bg-white border rounded p-4">
        <h3 className="text-lg font-semibold mb-2">Renter Report</h3>
        <p><strong>Name:</strong> {report.profile?.fullName}</p>
        <p><strong>Risk Score:</strong> {report.riskScore}</p>
        <p className="mt-2">{report.summary}</p>
      </div>

      {/* Status Actions */}
      <div className="flex gap-3">
        <button
          disabled={updating}
          onClick={() => updateStatus("in_review")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Mark In Review
        </button>

        <button
          disabled={updating}
          onClick={() => updateStatus("action_taken")}
          className="px-4 py-2 bg-yellow-600 text-white rounded"
        >
          Action Taken
        </button>

        <button
          disabled={updating}
          onClick={() => updateStatus("closed")}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Close Case
        </button>
      </div>
    </div>
  );
}
