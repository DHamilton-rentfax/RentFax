"use client";

import { useState } from "react";
import ExpandableSection from "../ExpandableSection";
import SectionUploadArea from "../SectionUploadArea";

export default function VehicleDrivingAndLegalSection() {
  const [accidents, setAccidents] = useState<boolean | null>(null);
  const [violations, setViolations] = useState<boolean | null>(null);
  const [criminalUse, setCriminalUse] = useState<boolean | null>(null);

  const isAttention = accidents || violations || criminalUse;

  const status =
    isAttention
      ? "attention"
      : accidents === false &&
        violations === false &&
        criminalUse === false
      ? "completed"
      : "empty";

  return (
    <ExpandableSection
      id="vehicle-driving"
      title="Driving, Accidents & Legal"
      description="Accidents, tickets, or suspected criminal use"
      status={status}
    >
      <div className="space-y-4">
        <Question
          label="Were there any accidents during the rental?"
          value={accidents}
          onChange={setAccidents}
        />
        <Question
          label="Were there traffic violations or tickets?"
          value={violations}
          onChange={setViolations}
        />
        <Question
          label="Was the vehicle suspected of being used for criminal activity?"
          value={criminalUse}
          onChange={setCriminalUse}
        />

        {isAttention && (
          <SectionUploadArea
            label="Upload evidence"
            hint="Accident reports, tickets, or police communication"
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
