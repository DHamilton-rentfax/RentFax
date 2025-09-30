// src/app/(app)/admin/disputes/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function AdminDisputeDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold">Dispute Review</h1>
      <p className="mt-2 text-gray-600">Reviewing dispute with ID: {id}</p>
    </div>
  );
}