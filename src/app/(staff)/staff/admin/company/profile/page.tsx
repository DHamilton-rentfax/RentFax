"use client";

import { useState } from "react";
import CompanyIndustrySelector from "@/components/company/CompanyIndustrySelector";

type Company = {
  industry?: string;
};

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company>({});

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-xl font-bold">Company Profile</h2>

      {/* ✅ THIS WAS THE BROKEN SECTION */}
      <h3 className="text-lg font-semibold mt-6">Industry</h3>

      <CompanyIndustrySelector
        value={company.industry}
        onChange={(v: string) =>
          setCompany((prev) => ({ ...prev, industry: v }))
        }
      />
    </div>
  );
}
