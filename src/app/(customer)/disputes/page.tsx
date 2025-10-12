"use client";
import { useState } from "react";
export default function RenterDisputesPage() {
  const [disputes] = useState([{ id: "dsp-001", status: "Under Review", date: "2025-10-09" }, { id: "dsp-002", status: "Resolved", date: "2025-09-20" }]);
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Disputes</h1>
      {disputes.length === 0 ? (
        <p>No disputes yet.</p>
      ) : (
        <ul className="space-y-4">
          {disputes.map((d) => (
            <li key={d.id} className="p-4 bg-white rounded-lg shadow border flex justify-between">
              <span>ID: {d.id}</span>
              <span>Status: {d.status}</span>
              <span className="text-gray-500 text-sm">{d.date}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
