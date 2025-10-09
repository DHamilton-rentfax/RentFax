"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function NewDisputePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const incidentId = searchParams.get("incident");
  const renterId = localStorage.getItem("renterId"); // Set when they log in/resolve
  const [statement, setStatement] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Upload files to Firebase Storage (pseudo for now)
      const evidenceUrls: string[] = [];
      for (const file of files) {
        // Implement storage upload logic later
        evidenceUrls.push(`https://fake.storage/${file.name}`);
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

      router.push("/renter/disputes?success=1");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Open a Dispute</h1>
      <p className="text-gray-600 mb-6">
        Incident ID: <span className="font-mono text-sm">{incidentId}</span>
      </p>

      <textarea
        className="w-full border rounded-lg p-3 mb-4"
        rows={6}
        placeholder="Explain what happened from your perspective..."
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
      />

      <input
        type="file"
        multiple
        onChange={handleUpload}
        className="mb-4 block"
      />

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
