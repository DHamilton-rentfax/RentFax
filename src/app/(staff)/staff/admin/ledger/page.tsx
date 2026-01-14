"use client";

import { useState } from "react";
import ReportLedger from "@/components/reports/ReportLedger";
import type { LedgerEntry, LedgerAction } from "@/types/ledger";

type LedgerQueryState = {
  actorId?: string;
  relatedObject?: string;
  action?: LedgerAction;
  startDate?: string;
  endDate?: string;
};

const LEDGER_ACTIONS: LedgerAction[] = [
  "REPORT_CREATED",
  "REPORT_UPDATED",
  "CREDIT_CONSUMED",
  "CREDIT_BLOCKED_ATTEMPT",
  "DISPUTE_FILED",
  "EVIDENCE_ADDED",
  "ADMIN_NOTE_ADDED",
  "IMPERSONATION_ACTION",
];

export default function AdminLedgerPage() {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [query, setQuery] = useState<LedgerQueryState>({});
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateQuery = (name: string, value?: string) => {
    setQuery((prev) => {
      if (!value) {
        const next = { ...prev };
        delete (next as any)[name];
        return next;
      }
      return { ...prev, [name]: value };
    });
  };

  const fetchEntries = async (reset = false) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ledger/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...query,
          cursor: reset ? null : cursor,
          limit: 25,
        }),
      });

      if (!res.ok) throw new Error("Ledger query failed");

      const data = await res.json();

      setEntries(reset ? data.entries : [...entries, ...data.entries]);
      setCursor(data.nextCursor ?? null);
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    const res = await fetch("/api/admin/ledger/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Ledger Explorer</h1>

      {/* Filters */}
      <div className="bg-gray-100 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            placeholder="Actor ID"
            className="p-2 border rounded"
            onChange={(e) => updateQuery("actorId", e.target.value)}
          />

          <input
            placeholder="Related Object"
            className="p-2 border rounded"
            onChange={(e) => updateQuery("relatedObject", e.target.value)}
          />

          <select
            className="p-2 border rounded"
            onChange={(e) =>
              updateQuery(
                "action",
                e.target.value ? e.target.value : undefined
              )
            }
          >
            <option value="">All actions</option>
            {LEDGER_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) =>
              updateQuery(
                "startDate",
                e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined
              )
            }
          />

          <input
            type="date"
            className="p-2 border rounded"
            onChange={(e) =>
              updateQuery(
                "endDate",
                e.target.value
                  ? new Date(e.target.value).toISOString()
                  : undefined
              )
            }
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => fetchEntries(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Search
          </button>

          <button
            onClick={exportCsv}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>
        </div>
      </div>

      <ReportLedger entries={entries} />

      {cursor && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchEntries()}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
