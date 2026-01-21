"use client";

import { useState } from "react";
import EvidenceUploader from "@/components/incident/EvidenceUploader";
import { uploadEvidenceFiles } from "@/lib/storage/uploadEvidenceFiles";
import { Button } from "@/components/ui/button";

export default function CreateReportPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function saveReport() {
    setSubmitting(true);

    try {
      // 1️⃣ Upload files
      const uploaded = await uploadEvidenceFiles(files);

      // 2️⃣ Send report payload
      await fetch("/api/report/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evidence: uploaded, // URLs / storage paths
        }),
      });

      alert("Report created");
    } catch (err) {
      console.error(err);
      alert("Failed to create report");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6 mx-auto mt-20 p-10 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold">Create Report</h1>

      <EvidenceUploader onFilesChange={setFiles} />

      <Button disabled={submitting} onClick={saveReport}>
        {submitting ? "Submitting..." : "Submit Report"}
      </Button>
    </div>
  );
}
