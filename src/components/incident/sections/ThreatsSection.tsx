"use client";

import { useState } from "react";

export default function ThreatsSection() {
  const [threatType, setThreatType] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Record threats or aggressive behavior directed at staff.
      </p>

      <Field label="Threat Type" value={threatType} onChange={setThreatType} />

      <div>
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full border rounded-md p-2 mt-1"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-1 block">
          Upload Evidence (audio, messages)
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