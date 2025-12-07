"use client";

import { useState } from "react";

export default function CriminalActivitySection() {
  const [type, setType] = useState("");
  const [police, setPolice] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Record suspected or confirmed criminal activity involving the vehicle.
      </p>

      <Field label="Type of Activity" value={type} onChange={setType} />
      <Field label="Police Report Number (if any)" value={police} onChange={setPolice} />

      <div>
        <label className="text-sm font-medium">Additional Notes</label>
        <textarea
          className="w-full border rounded-md p-2 mt-1"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Evidence */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Upload Evidence
        </label>
        <div className="border rounded-md p-3 bg-muted/40 text-sm text-muted-foreground">
          EvidenceUploader will be inserted here (Chunk 3)
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        className="w-full border rounded-md p-2 mt-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}