"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function IdentityReviewPage() {
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/identity/admin/list");
      const data = await res.json();
      setVerifications(data.items || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Identity Verifications</h1>

      <div className="grid gap-6">
        {verifications.map((v) => (
          <VerificationCard key={v.id} v={v} />
        ))}
      </div>
    </div>
  );
}

function VerificationCard({ v }: any) {
  const [decisionLoading, setDecisionLoading] = useState(false);

  const handleDecision = async (decision: "APPROVED" | "DENIED") => {
    setDecisionLoading(true);

    await fetch("/api/identity/admin/decision", {
      method: "POST",
      body: JSON.stringify({ verificationId: v.id, decision }),
    });

    alert(`Verification ${decision.toLowerCase()}`);
    location.reload();
  };

  return (
    <div className="border p-6 rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-3">{v.fullName}</h2>

      {/* Uploaded Docs */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <DocPreview label="Front ID" url={v.documents.frontIDUrl} />
        <DocPreview label="Back ID" url={v.documents.backIDUrl} />
        <DocPreview label="Selfie" url={v.documents.selfieUrl} />
      </div>

      {v.matchedScore !== null && (
        <p className="mb-4">
          <strong>Match Score:</strong>{" "}
          <span
            className={
              v.matchedScore >= 85
                ? "text-green-600"
                : v.matchedScore >= 60
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {v.matchedScore}%
          </span>
        </p>
      )}

      {/* Decision Buttons */}
      <div className="flex gap-4">
        <button
          disabled={decisionLoading}
          onClick={() => handleDecision("APPROVED")}
          className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Approve
        </button>
        <button
          disabled={decisionLoading}
          onClick={() => handleDecision("DENIED")}
          className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-2"
        >
          <XCircle className="w-5 h-5" /> Deny
        </button>
      </div>
    </div>
  );
}

function DocPreview({ label, url }: any) {
  return (
    <div>
      <p className="text-sm font-medium mb-1">{label}</p>
      <img
        src={url}
        className="w-full h-40 object-cover bg-gray-100 rounded border"
      />
    </div>
  );
}
