"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LawFirmCaseDetail() {
  const { caseId } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/agency/case/${caseId}`)
      .then(r => r.json())
      .then(setData);
  }, [caseId]);

  if (!data) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Legal Case #{caseId}</h2>

      <div className="bg-white p-4 border">
        <p>Status: {data.case.status}</p>
      </div>

      <div className="bg-white p-4 border">
        <h3 className="font-semibold">Renter Report</h3>
        <p>Name: {data.report.profile?.fullName}</p>
        <p>Risk Score: {data.report.riskScore}</p>
        <p className="mt-2">{data.report.summary}</p>
      </div>
    </div>
  );
}
