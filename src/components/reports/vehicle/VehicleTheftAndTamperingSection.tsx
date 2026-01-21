"use client";

import { useState } from "react";
import ExpandableSection from "../ExpandableSection";
import SectionUploadArea from "../SectionUploadArea";

export default function VehicleTheftAndTamperingSection() {
  const [stolen, setStolen] = useState<boolean | null>(null);
  const [recovered, setRecovered] = useState<boolean | null>(null);
  const [tampering, setTampering] = useState(false);

  const isAttention = stolen || tampering;

  const status =
    isAttention
      ? "attention"
      : stolen === false && tampering === false
      ? "completed"
      : "empty";

  return (
    <ExpandableSection
      id="vehicle-theft"
      title="Theft, Loss & Tampering"
      description="Stolen vehicles or tracking interference"
      status={status}
    >
      <div className="space-y-4">
        <Question
          label="Was the vehicle reported stolen?"
          value={stolen}
          onChange={setStolen}
        />

        {stolen && (
          <Question
            label="Was the vehicle recovered?"
            value={recovered}
            onChange={setRecovered}
          />
        )}

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={tampering}
            onChange={(e) => setTampering(e.target.checked)}
          />
          Evidence of GPS, tracker, or dashcam tampering
        </label>

        {isAttention && (
          <SectionUploadArea
            label="Upload evidence"
            hint="Police reports, photos, or GPS logs"
          />
        )}
      </div>
    </ExpandableSection>
  );
}

function Question({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium mb-2">{label}</p>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={value === false}
            onChange={() => onChange(false)}
          />
          No
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            checked={value === true}
            onChange={() => onChange(true)}
          />
          Yes
        </label>
      </div>
    </div>
  );
}
