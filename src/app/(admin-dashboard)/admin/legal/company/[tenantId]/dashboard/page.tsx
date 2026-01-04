"use client";

import { useParams } from "next/navigation";

export default function CompanyDashboard() {
  const { tenantId } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold">Company Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Tenant: <span className="font-mono">{tenantId}</span>
      </p>

      <div className="mt-6 p-6 bg-white rounded-lg shadow">
        <p className="text-gray-700">Company-specific analytics, stats, and reports will go here.</p>
      </div>
    </div>
  );
}
