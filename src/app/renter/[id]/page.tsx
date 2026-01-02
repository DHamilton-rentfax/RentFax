'use client';

import { useEffect, useState } from "react";

export default function RenterTimeline({ params }: any) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/renters/${params.id}/timeline`)
      .then(r => r.json())
      .then(setEvents);
  }, [params.id]);

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">
        Renter History
      </h1>

      <ul className="space-y-3">
        {events.map(e => (
          <li key={e.ts} className="border-l pl-4">
            <p className="text-sm font-medium">{e.type}</p>
            <p className="text-xs text-gray-500">
              {new Date(e.ts).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
