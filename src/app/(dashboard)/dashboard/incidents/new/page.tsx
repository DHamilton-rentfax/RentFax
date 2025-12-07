"use client";

import IncidentForm from "@/components/incident/IncidentForm";

export default function NewIncidentPage() {
  return (
    <div className="w-full flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-semibold mb-3">
          Create Incident Report
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          Provide detailed factual information about the incident. 
          Additional sections will appear as needed based on your selections.
        </p>

        <IncidentForm />
      </div>
    </div>
  );
}