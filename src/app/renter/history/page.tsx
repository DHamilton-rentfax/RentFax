"use client";

import { useEffect, useState } from "react";

type Incident = { id: string; type: string; notes: string; createdAt: number };

export default function RenterHistoryPage({ searchParams }: { searchParams: { token: string } }) {
  const { token } = searchParams;
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    fetch(`/api/renter/history?token=${token}`).then(r => r.json()).then(setIncidents);
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My History</h1>
      <div className="space-y-2">
        {incidents.map(i => (
          <div key={i.id} className="border p-3 rounded bg-white">
            <p><b>{i.type}</b></p>
            <p>{i.notes}</p>
            <p className="text-sm text-gray-500">On {new Date(i.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
