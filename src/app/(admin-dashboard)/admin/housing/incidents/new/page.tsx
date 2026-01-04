"use client";

import HousingIncidentForm from "@/components/housing/HousingIncidentForm";

export default function NewHousingIncidentPage() {
  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Report Housing Incident</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Provide an accurate and factual report. Additional questions will appear depending on the incident type.
      </p>

      <HousingIncidentForm />
    </div>
  );
}
