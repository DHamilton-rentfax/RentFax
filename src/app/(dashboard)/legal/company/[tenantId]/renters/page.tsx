"use client";

import { useParams } from "next/navigation";

export default function TenantRentersPage() {
  const { tenantId } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold">Renters</h1>
      <p className="text-gray-600 mt-2">All renters added by this company.</p>

      <div className="mt-6 p-6 bg-white rounded-lg shadow">
        <p>List + search renters will go here.</p>
      </div>
    </div>
  );
}
