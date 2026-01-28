// src/components/reports/ReportLedger.tsx
import { LEDGER_ACTION_LABELS } from "@/lib/ledger/labels";
import type { LedgerEntry } from "@/types/ledger";

type ReportLedgerProps = {
  entries: LedgerEntry[];
};

export function ReportLedger({ entries }: ReportLedgerProps) {
  if (!entries || entries.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-sm text-gray-500">
        <h3 className="font-semibold mb-2 text-gray-900">
          Report Activity
        </h3>
        <p>No activity has been recorded for this report yet.</p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="report-ledger-title"
      className="border rounded-lg p-4"
    >
      <h3
        id="report-ledger-title"
        className="font-semibold mb-3 text-gray-900"
      >
        Report Activity
      </h3>

      <ul className="space-y-2 text-sm text-gray-700">
        {entries.map((entry) => {
          const label =
            LEDGER_ACTION_LABELS[entry.action] ?? "Unknown action";
          
          const createdAt =
            typeof entry.createdAt === "string"
              ? new Date(entry.createdAt)
              : entry.createdAt instanceof Date
              ? entry.createdAt
              : entry.createdAt?.toDate?.();

          return (
            <li key={entry.id} className="flex items-start gap-2">
              <span className="font-medium">{label}</span>
              <span className="text-gray-400">•</span>
              <time
                dateTime={createdAt?.toISOString()}
                className="text-gray-500"
              >
                {createdAt ? createdAt.toLocaleString() : "—"}
              </time>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default ReportLedger;