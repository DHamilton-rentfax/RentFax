'use client';

export function VerificationHistory({ events }: { events: any[] }) {
  if (!events?.length) return <p className="text-sm text-gray-500">No verification history.</p>;

  return (
    <div className="border rounded-lg p-4 bg-white space-y-4">
      {events.map((e, idx) => (
        <div key={idx} className="border-l-2 border-gray-300 pl-3">
          <p className="text-xs font-semibold">{e.action}</p>
          <p className="text-xs text-gray-600">
            {new Date(e.createdAt).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{e.notes}</p>
        </div>
      ))}
    </div>
  );
}
