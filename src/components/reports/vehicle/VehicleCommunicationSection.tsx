"use client";

import { useState } from "react";
import ExpandableSection from "../ExpandableSection";
import SectionUploadArea from "../SectionUploadArea";

export default function VehicleCommunicationSection() {
  const [communication, setCommunication] = useState<
    "responsive" | "intermittent" | "cutoff" | null
  >(null);

  const isAttention = communication === "cutoff";

  const status =
    isAttention
      ? "attention"
      : communication
      ? "completed"
      : "empty";

  return (
    <ExpandableSection
      id="vehicle-communication"
      title="Communication & Cooperation"
      description="Responsiveness and compliance"
      status={status}
    >
      <div className="space-y-3">
        <Option
          label="Responsive and cooperative"
          checked={communication === "responsive"}
          onClick={() => setCommunication("responsive")}
        />
        <Option
          label="Intermittent communication"
          checked={communication === "intermittent"}
          onClick={() => setCommunication("intermittent")}
        />
        <Option
          label="Cut off communication or avoided contact"
          checked={communication === "cutoff"}
          onClick={() => setCommunication("cutoff")}
        />

        {isAttention && (
            <SectionUploadArea
                label="Upload evidence"
                hint="Screenshots of ignored calls, messages, or emails"
            />
        )}
      </div>
    </ExpandableSection>
  );
}

function Option({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <input type="radio" checked={checked} onChange={onClick} />
      {label}
    </label>
  );
}
