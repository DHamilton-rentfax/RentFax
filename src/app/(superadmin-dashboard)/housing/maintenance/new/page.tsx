"use client";

import MaintenanceForm from "@/components/housing/MaintenanceForm";

export default function NewMaintenancePage() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Log Maintenance Issue</h1>
      <MaintenanceForm />
    </div>
  );
}
