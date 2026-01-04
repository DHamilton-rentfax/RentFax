"use client";

import { useState } from "react";

export default function EvidenceUploadPanel({
  reportId,
}: {
  reportId: string;
}) {
  const [loading, setLoading] = useState(false);

  async function handleUpload(file: File) {
    setLoading(true);

    // Assume file already uploaded to storage
    const fileUrl = "/uploads/example.pdf";

    await fetch("/api/reports/upload-evidence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reportId,
        fileUrl,
        uploadedBy: "org",
      }),
    });

    window.location.reload();
  }

  return (
    <div className="border rounded-md p-4 mt-4">
      <div className="font-semibold mb-2">Upload Evidence</div>

      <input
        type="file"
        disabled={loading}
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
      />

      {loading && <p className="text-sm mt-2">Uploading…</p>}
    </div>
  );
}
