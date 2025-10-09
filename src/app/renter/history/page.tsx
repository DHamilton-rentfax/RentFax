
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import * as React from "react";

type Incident = { id: string; type: string; notes: string; createdAt: number };

export default function RenterHistoryPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/renter/history?token=${token}`).then(r => r.json()).then(setIncidents);
  }, [token]);

  const handleExport = (format: 'csv' | 'pdf') => {
    window.open(`/api/renter/disputes/export?format=${format}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My History</h1>
        <div className="space-x-2">
          <Button onClick={() => handleExport('csv')}>Export as CSV</Button>
          <Button onClick={() => handleExport('pdf')}>Export as PDF</Button>
        </div>
      </div>
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
