"use client";

import { useEffect, useState } from "react";

export default function AdminIdentitySessions() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/identity-sessions");
      const data = await res.json();
      setSessions(data.sessions);
    }
    load();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Identity Sessions</h1>

      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="border rounded-lg p-4 bg-white shadow-sm"
          >
            <p className="font-semibold">{s.renterName}</p>
            <p className="text-sm text-gray-600">
              {s.renterEmail} • {s.renterPhone}
            </p>

            <p className="text-sm mt-2">
              <strong>Status:</strong> {s.status}
            </p>
            <p className="text-sm">
              <strong>Created:</strong>{" "}
              {new Date(s.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
