"use client";

import { useState } from "react";
import { createDispute } from "@/server-actions/disputes/createDispute";

export default function RenterDisputesPage() {
  const [reason, setReason] = useState("");

  async function submit() {
    await createDispute({
      reportNameId: "REPORT_ID_HERE",
      reason,
    });
    setReason("");
    alert("Dispute submitted");
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Submit a Dispute</h2>

      <textarea
        className="border p-2 w-full"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Explain the issue…"
      />

      <button
        className="mt-3 px-4 py-2 bg-black text-white rounded"
        onClick={submit}
      >
        Submit Dispute
      </button>
    </div>
  );
}
