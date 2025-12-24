"use client";

import { useState, useEffect } from "react";
import { INDUSTRIES } from "@/constants/industries";
import { updateCompanyIndustries } from "@/app/actions/update-company-industries";
// import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
// import { MultiSelect } from "@/components/ui/multi-select"; // You will create this component below

const MultiSelect = ({label, options, selected, onChange}) => { return <div />}

export default function CompanySettingsPage() {
  // const { claims } = useAuth();
  // const companyId = claims?.companyId;

  const [industries, setIndustries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState("")

  useEffect(() => {
    const companyId = localStorage.getItem("companyId")
    if(companyId) setCompanyId(companyId)
    if (!companyId) return;
    const loadCompany = async () => {
      const snap = await getDoc(doc(db, "companies", companyId));
      if (snap.exists()) {
        setIndustries(snap.data().industryTypes || []);
      }
      setLoading(false);
    };
    loadCompany();
  }, [companyId]);

  const onSave = async () => {
    await updateCompanyIndustries(companyId, industries);
    alert("Industries updated");
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-6">Company Settings</h1>

      <MultiSelect
        label="Select Your Rental Industries"
        options={INDUSTRIES.map(i => ({ value: i.id, label: i.label }))}
        selected={industries}
        onChange={setIndustries}
      />

      <Button className="mt-6" onClick={onSave}>
        Save Changes
      </Button>
    </div>
  );
}
