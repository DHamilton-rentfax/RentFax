'use client';

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";

type Dispute = { id: string; renterName: string; status: string; createdAt: number };

export default function ClientDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const { notify } = useToast();

  useEffect(() => {
    fetch("/api/client/disputes?orgId=demo-org").then(r => r.json()).then(setDisputes);
  }, []);

  function resolveDispute(id: string) {
    fetch(`/api/client/disputes/${id}/resolve`, { method: "POST" }).then(() => {
      setDisputes(disputes.map(d => d.id === id ? { ...d, status: "resolved" } : d));
      notify("Dispute resolved!", "success");
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Disputes</h1>
      <div className="space-y-2">
        {disputes.map(d => (
          <div key={d.id} className="border p-3 rounded bg-white shadow flex justify-between items-center">
            <div>
              <p><b>{d.renterName}</b> — {d.status}</p>
              <p className="text-sm text-gray-500">Filed {new Date(d.createdAt).toLocaleDateString()}</p>
            </div>
            {d.status === "open" && <Button onClick={() => resolveDispute(d.id)}>Resolve</Button>}
          </div>
        ))}
      </div>
    </div>
  );
}
