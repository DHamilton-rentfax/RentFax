"use client";

import { useState } from "react";
import EvidenceUpload from "@/components/shared/EvidenceUpload";

const FIELDS = [
  "Payment History",
  "Property Condition",
  "Incident Description",
  "Dates / Timeline",
  "Other",
];

export default function DisputeForm({ reportNameId }: { reportNameId: string }) {
  const [field, setField] = useState("");
  const [message, setMessage] = useState("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    await fetch("/api/disputes/create", {
      method: "POST",
      body: JSON.stringify({
        reportNameId,
        field,
        message,
        evidence,
      }),
    });
    alert("Dispute submitted");
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select disputed section</option>
        {FIELDS.map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Explain your dispute factually"
        className="w-full border rounded p-2"
      />

      <EvidenceUpload onUpload={setEvidence} />

      <button
        disabled={submitting}
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit Dispute
      </button>
    </div>
  );
}
