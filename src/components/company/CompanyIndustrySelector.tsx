"use client";

import { INDUSTRIES } from "@/lib/company/industry";

export default function CompanyIndustrySelector({ value, onChange }: any) {
  return (
    <select
      className="border p-3 rounded w-full"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select Industry</option>
      {INDUSTRIES.map(i => (
        <option key={i} value={i}>{i.replace("_", " ")}</option>
      ))}
    </select>
  );
}
