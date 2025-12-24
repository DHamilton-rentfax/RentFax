"use client";

import { useParams, useEffect, useState } from "react";

export default function PartnerDetailPage() {
  const { orgId } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/partners/${orgId}`)
      .then(r => r.json())
      .then(setData);
  }, [orgId]);

  if (!data) return <p>Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{data.partner.name}</h1>

      <div className="bg-white p-4 border">
        <p>Type: {data.partner.type}</p>
        <p>Billing: {data.partner.billing.status}</p>
      </div>

      <div className="bg-white p-4 border">
        <h2 className="font-semibold mb-2">Assigned Cases</h2>
        {data.cases.map((c: any) => (
          <p key={c.caseId}>            {c.caseId} — {c.status}
          </p>
        ))}
      </div>
    </div>
  );
}
