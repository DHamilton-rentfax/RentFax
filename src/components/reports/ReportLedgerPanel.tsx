'use client';

type LedgerEntry = {
  id: string;
  action: string;
  createdAt: string;
};

function formatAction(action: string) {
  return action
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export function ReportLedgerPanel({
  entries,
}: {
  entries: LedgerEntry[];
}) {
  if (!entries.length) {
    return (
      <div className="text-sm text-gray-500">
        No activity recorded for this report.
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="font-semibold mb-3">Report Activity</h3>

      <ul className="space-y-2 text-sm text-gray-700">
        {entries.map((entry) => (
          <li key={entry.id} className="flex justify-between">
            <span>{formatAction(entry.action)}</span>
            <span className="text-gray-400">
              {new Date(entry.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
