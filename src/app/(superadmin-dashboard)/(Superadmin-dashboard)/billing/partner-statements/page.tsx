'use client';

import { useEffect, useState } from "react";

export default function PartnerStatementsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const r = await fetch("/api/admin/billing/partner-statements");
    const d = await r.json();
    setRows(d.statements || []);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Partner Statements</h1>

      {loading ? <p>Loading…</p> : null}

      <div className="space-y-3">
        {rows.map((s) => (
          <div key={s.id} className="bg-white border rounded p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">Org: {s.partnerOrgId}</p>
                <p className="text-sm text-gray-600">
                  Period: {s.period} • Status: {s.status}
                </p>
                <p className="text-sm">
                  Total: ${(s.totals?.total ?? 0) / 100}
                </p>
              </div>

              <div className="flex gap-3 text-sm">
                <button
                  className="underline"
                  onClick={async () => {
                    await fetch("/api/admin/billing/partner-statements/approve", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ statementId: s.id }),
                    });
                    refresh();
                  }}
                >
                  Approve
                </button>

                <button
                  className="underline"
                  onClick={async () => {
                    await fetch("/api/admin/billing/partner-statements/invoice", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ statementId: s.id }),
                    });
                    refresh();
                  }}
                >
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
