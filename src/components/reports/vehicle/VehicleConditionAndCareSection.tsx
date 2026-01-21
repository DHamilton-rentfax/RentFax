"use client";

import { useState } from "react";
import ExpandableSection from "../ExpandableSection";
import SectionUploadArea from "../SectionUploadArea";

export default function VehicleConditionAndCareSection() {
  const [cleanReturn, setCleanReturn] = useState<boolean | null>(null);
  const [smokedIn, setSmokedIn] = useState<boolean | null>(null);
  const [excessWear, setExcessWear] = useState<boolean | null>(null);

  const isAttention = smokedIn || excessWear;

  const status =
    isAttention
      ? "attention"
      : cleanReturn === true && smokedIn === false && excessWear === false
      ? "completed"
      : "empty";

  return (
    <ExpandableSection
      id="vehicle-condition"
      title="Asset Condition & Care"
      description="Cleanliness, wear, or smoking"
      status={status}
    >
      <div className="space-y-4">
        <Question
          label="Was the vehicle returned clean?"
          value={cleanReturn}
          onChange={setCleanReturn}
        />
        <Question
          label="Was the vehicle smoked in?"
          value={smokedIn}
          onChange={setSmokedIn}
        />
        <Question
          label="Was there excess wear beyond normal use?"
          value={excessWear}
          onChange={setExcessWear}
        />
        {isAttention && (
          <SectionUploadArea
            label="Upload evidence"
            hint="Photos of damage, cleaning receipts, or repair estimates"
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
