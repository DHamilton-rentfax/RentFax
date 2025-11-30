"use client";

type Incident = {
  id: string;
  title?: string;
  type?: string;
  status?: string;
  amount?: number;
  createdAt?: any; // timestamp or ISO string
  companyName?: string;
};

function formatDate(val: any) {
  if (!val) return "Unknown date";
  if (typeof val === "string") return new Date(val).toLocaleDateString();
  if (val.toDate) return val.toDate().toLocaleDateString();
  return "Unknown date";
}

export default function IncidentTimeline({ incidents }: { incidents: Incident[] }) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="bg-white border rounded-2xl shadow p-8">
      <h2 className="text-2xl font-semibold mb-4">Incident Timeline</h2>

      <div className="relative border-l border-gray-200 ml-3 space-y-6">
        {incidents.map((inc) => {
          const status = (inc.status || "").toLowerCase();
          const color =
            status === "open"
              ? "bg-red-500"
              : status === "disputed"
              ? "bg-yellow-500"
              : "bg-green-500";

          return (
            <div key={inc.id} className="relative pl-6">
              <span className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full ${color}`} />

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">
                    {inc.title || inc.type || "Incident"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {formatDate(inc.createdAt)}
                  </span>
                </div>

                {inc.companyName && (
                  <p className="text-xs text-gray-500">
                    Reported by: {inc.companyName}
                  </p>
                )}

                {typeof inc.amount === "number" && (
                  <p className="text-sm text-gray-700">
                    Amount: ${inc.amount.toFixed(2)}
                  </p>
                )}

                <span className="inline-block text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 mt-1">
                  Status: {inc.status || "Unknown"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
