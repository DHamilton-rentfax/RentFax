"use client";
import { useEffect, useState } from "react";
import { IncidentCard } from "@/components/admin/IncidentCard";

export default function IncidentDashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/admin/incidents")
      .then(r => r.json())
      .then(setItems);
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Incident Management Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(i => (
          <IncidentCard key={i.incidentId} incident={i} />
        ))}
      </div>
    </div>
  );
}
