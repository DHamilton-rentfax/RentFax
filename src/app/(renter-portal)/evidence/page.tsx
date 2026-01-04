"use client";

import { useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { createEvidence } from "@/server-actions/evidence/createEvidence";
import { firebaseApp } from "@/firebase/client";

export default function EvidenceUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    setLoading(true);

    const storage = getStorage(firebaseApp);
    const fileRef = ref(
      storage,
      `evidence/${crypto.randomUUID()}/${file.name}`
    );

    await uploadBytes(fileRef, file, {
      customMetadata: {
        renterId: "CURRENT_USER",
      },
    });

    await createEvidence({
      disputeId: "DISPUTE_ID",
      reportNameId: "REPORT_ID",
      filePath: fileRef.fullPath,
    });

    setLoading(false);
    alert("Evidence uploaded");
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload Evidence</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />

      <button
        disabled={loading}
        onClick={upload}
        className="mt-3 px-4 py-2 bg-black text-white rounded"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
