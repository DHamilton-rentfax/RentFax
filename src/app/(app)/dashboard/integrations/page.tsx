"use client";

import { useState } from "react";

export default function IntegrationsPage() {
  const [msg, setMsg] = useState("");

  async function sendToCollections() {
    const res = await fetch("/api/integrations/collections", {
      method: "POST",
      body: JSON.stringify({ orgId: "demo-org", renterId: "r1", amount: 250 }),
    });
    const data = await res.json();
    setMsg(data.message);
  }

  async function checkInsurance() {
    const res = await fetch("/api/integrations/insurance", {
      method: "POST",
      body: JSON.stringify({ renterId: "r1", policyNumber: "POL-999" }),
    });
    const data = await res.json();
    setMsg(data.valid ? "Valid insurance" : "Invalid policy");
  }

  async function searchRecords() {
    const res = await fetch("/api/integrations/public-records", {
      method: "POST",
      body: JSON.stringify({ renterName: "John Smith" }),
    });
    const data = await res.json();
    setMsg(JSON.stringify(data.matches));
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Integrations</h1>
      <button onClick={sendToCollections} className="px-4 py-2 bg-red-500 text-white rounded">
        Send to Collections
      </button>
      <button onClick={checkInsurance} className="px-4 py-2 bg-blue-500 text-white rounded">
        Check Insurance
      </button>
      <button onClick={searchRecords} className="px-4 py-2 bg-green-500 text-white rounded">
        Search Public Records
      </button>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
