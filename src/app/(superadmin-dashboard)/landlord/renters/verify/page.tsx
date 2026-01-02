
"use client";

import { useState } from "react";

export default function VerificationStatusPage() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<any>(null);

  async function check() {
    const res = await fetch(`/api/renter-status?phone=${phone}`);
    const json = await res.json();
    setResult(json);
  }

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Check Verification Status</h1>

      <input
        className="border p-2 rounded w-full mb-4"
        placeholder="Enter renter phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={check}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Check Status
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl">Status: {result.status}</h3>

          {result.details && (
            <div className="mt-2 text-sm text-gray-700">
              <p>Identity: {result.details.identity}</p>
              <p>Device: {result.details.device}</p>
              <p>Fraud Risk: {result.details.fraudRisk}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
