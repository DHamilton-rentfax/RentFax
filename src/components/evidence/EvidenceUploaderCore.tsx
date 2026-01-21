"use client";

import { useState } from "react";
import { uploadEvidence } from "@/lib/storage/uploadEvidence";
import { analyzeEvidence } from "@/lib/ai/analyzeEvidence";

type EvidenceResult = {
  extracted?: {
    incidentDate?: string;
    amount?: number;
    description?: string;
    parties?: string[];
  };
};

interface Props {
  incidentId: string;
  renterId?: string;
  onAnalyzed?: (data: EvidenceResult["extracted"]) => void;
}

export default function EvidenceUploaderCore({
  incidentId,
  renterId,
  onAnalyzed,
}: Props) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);

    try {
      // 1️⃣ Upload file
      const { storagePath, downloadURL } = await uploadEvidence({
        file,
        incidentId,
        renterId,
      });

      // 2️⃣ Trigger AI analysis
      const analysis = await analyzeEvidence({
        incidentId,
        storagePath,
        downloadURL,
      });

      // 3️⃣ Auto-fill form
      if (analysis?.extracted && onAnalyzed) {
        onAnalyzed(analysis.extracted);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".pdf,image/*,video/*"
        onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
      />

      {uploading && <p className="text-sm text-gray-500">Analyzing evidence…</p>}
    </div>
  );
}
