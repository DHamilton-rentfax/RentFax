"use client";

import { INDUSTRIES } from "@/constants/industries";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { updateCompanyIndustries } from "@/app/actions/update-company-industries";

export default function IndustryToggles({ companyId, initial }) {
  const [industries, setIndustries] = useState(initial || []);

  const toggleIndustry = async (id: string) => {
    let updated;

    if (industries.includes(id)) {
      updated = industries.filter(i => i !== id);
    } else {
      updated = [...industries, id];
    }

    setIndustries(updated);
    await updateCompanyIndustries(companyId, updated);
  };

  return (
    <div className="space-y-4">
      {INDUSTRIES.map(ind => (
        <div key={ind.id} className="flex justify-between items-center">
          <span>{ind.label}</span>
          <Switch
            checked={industries.includes(ind.id)}
            onCheckedChange={() => toggleIndustry(ind.id)}
          />
        </div>
      ))}
    </div>
  );
}
