"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, X, Flag, Snowflake, ShieldAlert } from "lucide-react";

export default function OversightDashboard() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const d = await fetch("/api/superadmin/queries/disputes").then((r) => r.json());
    const i = await fetch("/api/superadmin/queries/incidents").then((r) => r.json());

    setDisputes(d.items);
    setIncidents(i.items);
    setLoading(false);
  }

  async function action(type: string, payload: any) {
    await fetch("/api/superadmin/oversight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    await loadData();
  }

  if (loading) return <p>Loading oversight…</p>;

  return (
    <div className="space-y-16">
      <h1 className="text-3xl font-bold">Incident & Dispute Oversight</h1>

      {/* DISPUTES TABLE */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Disputes Under Review</h2>

        <div className="border rounded-xl bg-white shadow">
          {disputes.map((d) => (
            <div key={d.id} className="p-5 flex justify-between items-center border-b last:border-none">
              <div>
                <p className="font-semibold">{d.renterName}</p>
                <p className="text-sm text-gray-600">{d.reason}</p>
                <p className="text-xs text-gray-400">{new Date(d.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded-lg flex items-center gap-1"
                  onClick={() =>
                    action("approve_dispute", {
                      action: "approve_dispute",
                      disputeId: d.id,
                      incidentId: d.incidentId,
                      adminId: "SUPERADMIN",
                    })
                  }
                >
                  <Check className="h-4 w-4" /> Approve
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded-lg flex items-center gap-1"
                  onClick={() =>
                    action("reject_dispute", {
                      action: "reject_dispute",
                      disputeId: d.id,
                      incidentId: d.incidentId,
                      adminId: "SUPERADMIN",
                    })
                  }
                >
                  <X className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* INCIDENTS TABLE */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Incident Oversight</h2>

        <div className="border rounded-xl bg-white shadow">
          {incidents.map((i) => (
            <div key={i.id} className="p-5 flex justify-between items-center border-b last:border-none">
              <div>
                <p className="font-semibold">{i.renterName}</p>
                <p className="text-sm text-gray-600">{i.description}</p>
                <p className="text-xs text-gray-400">{new Date(i.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                {/* ESCALATE */}
                <button
                  className="px-3 py-1 bg-yellow-500 text-white rounded-lg flex items-center gap-1"
                  onClick={() =>
                    action("escalate_incident", {
                      action: "escalate_incident",
                      incidentId: i.id,
                      adminId: "SUPERADMIN",
                      overrideReason: "Manual escalation by admin.",
                    })
                  }
                >
                  <Flag className="h-4 w-4" /> Escalate
                </button>

                {/* FREEZE RENTER */}
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center gap-1"
                  onClick={() =>
                    action("freeze_renter", {
                      action: "freeze_renter",
                      renterId: i.renterId,
                      adminId: "SUPERADMIN",
                    })
                  }
                >
                  <Snowflake className="h-4 w-4" /> Freeze
                </button>

                {/* MARK HIGH RISK */}
                <button
                  className="px-3 py-1 bg-red-700 text-white rounded-lg flex items-center gap-1"
                  onClick={() =>
                    action("mark_high_risk", {
                      action: "mark_high_risk",
                      renterId: i.renterId,
                      adminId: "SUPERADMIN",
                    })
                  }
                >
                  <ShieldAlert className="h-4 w-4" /> High Risk
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
