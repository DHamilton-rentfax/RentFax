'use client';

import { useEffect, useState } from "react";

export default function AdminVerificationPage() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/verifications")
      .then(r => r.json())
      .then(setPending);
  }, []);

  async function override(reportId: string) {
    await fetch("/api/admin/verifications/override", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId }),
    });
    setPending(p => p.filter(r => r.reportId !== reportId));
  }

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-4">
        Pending Verifications
      </h1>

      {pending.map(v => (
        <div key={v.reportId} className="border p-4 rounded mb-3">
          <p><strong>Renter:</strong> {v.renterName}</p>
          <p><strong>Method:</strong> {v.method}</p>

          <button
            onClick={() => override(v.reportId)}
            className="mt-2 bg-black text-white px-3 py-1 rounded text-sm"
          >
            Override & Unlock
          </button>
        </div>
      ))}
    </div>
  );
}
