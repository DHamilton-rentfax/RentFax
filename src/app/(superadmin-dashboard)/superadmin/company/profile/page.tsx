"use client";

import { useState } from "react";
import CompanyIndustrySelector from "@/components/company/CompanyIndustrySelector";

type Company = {
  industry?: string;
};

export default function CompanyProfilePage() {
  const [company, setCompany] = useState<Company>({});

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-semibold mb-4">Company Profile</h1>

      <h3 className="text-lg font-semibold mt-6">Industry</h3>

      <CompanyIndustrySelector
        value={company.industry}
        onChange={(v: any) =>
          setCompany((prev) => ({ ...prev, industry: v }))
        }
      />
    </div>
  );
}
