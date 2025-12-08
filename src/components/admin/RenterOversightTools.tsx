"use client";

import { useState } from "react";
import { Snowflake, ShieldAlert, GitMerge } from "lucide-react";

export function RenterOversightTools({ renterId }: { renterId: string }) {
  const [mergeId, setMergeId] = useState("");

  async function act(action: string, extra?: any) {
    await fetch("/api/superadmin/oversight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        renterId,
        adminId: "SUPERADMIN",
        ...extra,
      }),
    });

    alert("Action completed");
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow space-y-4">
      <h3 className="font-semibold text-lg">Oversight Controls</h3>

      <button
        onClick={() => act("freeze_renter")}
        className="w-full flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2"
      >
        <Snowflake className="h-4 w-4" /> Freeze Renter
      </button>

      <button
        onClick={() => act("mark_high_risk")}
        className="w-full flex items-center gap-2 bg-red-600 text-white rounded-lg px-4 py-2"
      >
        <ShieldAlert className="h-4 w-4" /> Mark as High Risk
      </button>

      <div className="pt-2">
        <p className="text-sm font-medium mb-1">Merge Into Renter ID</p>
        <div className="flex gap-2">
          <input
            value={mergeId}
            onChange={(e) => setMergeId(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
          <button
            onClick={() => act("merge_renters", { mergeIntoId: mergeId })}
            className="bg-purple-600 text-white rounded-lg px-4 py-2 flex items-center gap-1"
          >
            <GitMerge className="h-4 w-4" />
            Merge
          </button>
        </div>
      </div>
    </div>
  );
}
