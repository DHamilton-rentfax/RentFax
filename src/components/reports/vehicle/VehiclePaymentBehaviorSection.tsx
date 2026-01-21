"use client";

import { useState } from "react";
import ExpandableSection from "../ExpandableSection";
import SectionUploadArea from "../SectionUploadArea";

export default function VehiclePaymentBehaviorSection() {
  const [latePayments, setLatePayments] = useState<boolean | null>(null);
  const [chargebacks, setChargebacks] = useState<boolean | null>(null);
  const [unpaidFees, setUnpaidFees] = useState<boolean | null>(null);

  const isAttention = latePayments || chargebacks || unpaidFees;

  const status =
    isAttention
      ? "attention"
      : latePayments === false &&
        chargebacks === false &&
        unpaidFees === false
      ? "completed"
      : "empty";

  return (
    <ExpandableSection
      id="vehicle-payment"
      title="Payment & Financial Behavior"
      description="Late payments, disputes, or unpaid fees"
      status={status}
    >
      <div className="space-y-4">
        <Question
          label="Were all payments made on time?"
          value={latePayments}
          onChange={setLatePayments}
        />
        <Question
          label="Were there any chargebacks or bank disputes?"
          value={chargebacks}
          onChange={setChargebacks}
        />
        <Question
          label="Were there unpaid tolls, tickets, or fees passed to your company?"
          value={unpaidFees}
          onChange={setUnpaidFees}
        />

        {isAttention && (
            <SectionUploadArea
                label="Upload evidence"
                hint="Invoices, payment history, or dispute notices"
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
