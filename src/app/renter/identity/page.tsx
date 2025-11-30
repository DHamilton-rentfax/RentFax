"use client";

import { useEffect, useState } from "react";
import { IdentityVerificationResult } from "@/types/identity";

export default function RenterIdentityPage() {
  const [identity, setIdentity] = useState<IdentityVerificationResult | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/identity/get"); // You may adjust route later
      if (!res.ok) return;
      const data = await res.json();
      setIdentity(data.identity ?? null);
    }
    load();
  }, []);

  if (!identity) {
    return <div className="p-6 text-gray-500">Identity not verified yet.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Identity Verification</h1>

      <div className="grid grid-cols-2 gap-4">
        {identity.idFrontUrl && (
          <img src={identity.idFrontUrl} className="rounded shadow" />
        )}
        {identity.idBackUrl && (
          <img src={identity.idBackUrl} className="rounded shadow" />
        )}
        {identity.selfieUrl && (
          <img src={identity.selfieUrl} className="rounded shadow" />
        )}
      </div>

      <div className="text-gray-700">
        <p>Face Match Score: {identity.faceMatchScore ?? "N/A"}</p>
        <p>Final Score: {identity.finalScore ?? "N/A"}</p>
        <p>Status: {identity.verified ? "Verified" : "Not Verified"}</p>
      </div>
    </div>
  );
}
