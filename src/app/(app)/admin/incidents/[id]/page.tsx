// src/app/(app)/admin/incidents/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function AdminIncidentDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Incident Review</h1>
      <p className="mt-2 text-gray-600">Reviewing incident with ID: {id}</p>
    </div>
  );
}