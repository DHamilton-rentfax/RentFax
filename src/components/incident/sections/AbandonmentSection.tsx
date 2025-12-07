"use client";

import { useState } from "react";

export default function AbandonmentSection() {
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");
  const [towed, setTowed] = useState("");

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Record details about improper returns, abandoned vehicles, or out-of-state drop-offs.
      </p>

      <Field
        label="Where was the vehicle found?"
        value={location}
        onChange={setLocation}
      />

      <Field
        label="How long was the vehicle missing?"
        value={duration}
        onChange={setDuration}
      />

      <Field
        label="Was towing involved?"
        value={towed}
        onChange={setTowed}
      />

      {/* Evidence placeholder */}
      <div>
        <label className="text-sm font-medium mb-1 block">
          Upload Evidence (tow receipts, GPS screenshots)
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