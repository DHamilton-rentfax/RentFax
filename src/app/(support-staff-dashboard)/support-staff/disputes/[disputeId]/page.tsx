"use client";

import { useParams } from "next/navigation";

export default function DisputeDetailPage() {
  const { disputeId } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dispute #{disputeId}</h1>
      <div className="border bg-white p-6 rounded-xl shadow-sm">
        <p>Dispute details and evidence would be displayed here.</p>
      </div>
    </div>
  );
}
