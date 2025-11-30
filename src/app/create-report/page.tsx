
"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import RenterUploadEvidence from "@/components/renter/RenterUploadEvidence";

export default function CreateReportPage() {
  const params = useSearchParams();
  const renterId = params.get("renterId");
  const searchId = params.get("searchId");

  const [evidence, setEvidence] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const addEvidence = (payload: any) => {
    setEvidence([...evidence, payload]);
  };

  const saveReport = async () => {
    setSaving(true);

    const res = await fetch("/api/report/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        renterId,
        searchId,
        evidence,
      }),
    });

    setSaving(false);

    const data = await res.json();

    if (data.reportId) {
      setDone(true);
      window.location.href = `/report/${data.reportId}`;
    }
  };

  if (done) return null;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-10 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold">Create Renter Report</h1>
      <p className="text-gray-600 mt-2">
        Add any supporting documents, notes, or information to finalize the
        renter report.
      </p>

      <div className="mt-8 space-y-6">
        <RenterUploadEvidence
          onSubmit={(payload) => addEvidence(payload)}
          close={() => {}}
        />

        <Button
          className="w-full bg-[#1A2540] hover:bg-[#243355] mt-6"
          disabled={saving}
          onClick={saveReport}
        >
          {saving ? "Saving..." : "Save & View Report"}
        </Button>
      </div>
    </div>
  );
}
