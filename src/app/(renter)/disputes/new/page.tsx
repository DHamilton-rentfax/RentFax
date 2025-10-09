"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFileUpload } from "@/hooks/use-file-upload";

export default function NewDisputePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const incidentId = searchParams.get("incident");
  const renterId = localStorage.getItem("renterId");
  const [statement, setStatement] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { uploadFile, progress } = useFileUpload();

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // Upload each file to Firebase Storage
      const evidenceUrls: string[] = [];
      for (const file of files) {
        const url = await uploadFile(file);
        evidenceUrls.push(url);
      }

      // 2. Create dispute
      const res = await fetch("/api/disputes/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renterId,
          incidentId,
          renterStatement: statement,
          evidenceUrls,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      router.push("/renter/disputes?submitted=1");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 mt-10 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Submit a Dispute</h1>

      <textarea
        className="w-full border rounded-lg p-3 mb-4"
        rows={6}
        placeholder="Explain your situation..."
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
      />

      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload supporting files:
      </label>
      <input type="file" multiple onChange={handleUploadChange} className="mb-4" />

      {progress > 0 && progress < 100 && (
        <p className="text-sm text-gray-500 mb-3">Uploading: {Math.round(progress)}%</p>
      )}

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Dispute"}
      </button>
    </div>
  );
}
