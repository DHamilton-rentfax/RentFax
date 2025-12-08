"use client";

import { useEffect, useState } from "react";

export default function VerifyReviewPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  async function load() {
    const res = await fetch("/api/verify/admin/list");
    const json = await res.json();
    setSessions(json.sessions || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function update(token: string, status: "approved" | "rejected") {
    const notes = prompt("Reviewer notes:");
    const res = await fetch("/api/verify/admin/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, status, notes }),
    });

    if (!res.ok) {
      alert("Failed.");
      return;
    }

    alert("Updated.");
    load();
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Identity Verification Review</h1>

      <div className="space-y-6">
        {sessions.map((s) => (
          <div key={s.token} className="border p-4 rounded-lg bg-white shadow">
            <p className="font-semibold">{s.renter.fullName}</p>
            <p className="text-sm text-gray-600">{s.renter.email}</p>
            <p className="text-sm text-gray-600">{s.renter.phone}</p>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {s.idFrontUrl && <img src={s.idFrontUrl} className="rounded-lg border" />}
              {s.idBackUrl && <img src={s.idBackUrl} className="rounded-lg border" />}
              {s.selfieUrl && <img src={s.selfieUrl} className="rounded-lg border" />}
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => update(s.token, "approved")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Approve
              </button>
              <button
                onClick={() => update(s.token, "rejected")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
