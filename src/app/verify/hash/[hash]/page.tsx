"use client";

import { useEffect, useState } from "react";

export default function VerifyPage({ params }) {
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/verify", {
        method: "POST",
        body: JSON.stringify({ hash: params.hash })
      });

      setData(await res.json());
    })();
  }, []);

  if (!data) return <p>Loading verification...</p>;

  if (!data.valid)
    return <div className="text-red-600 text-xl">❌ Report NOT verified.</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Report Verification</h1>

      <p>✓ This report is verified and exists on blockchain.</p>

      <div className="mt-4 p-4 border rounded">
        <p><strong>Chain:</strong> {data.chain}</p>
        <p><strong>Transaction:</strong> {data.txHash}</p>
        <p><strong>Incident:</strong> {data.incidentId}</p>
        <p><strong>Renter:</strong> {data.renterId}</p>
        <p><strong>Anchored:</strong> {new Date(data.anchoredAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
