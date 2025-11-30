"use client";

import { useEffect, useState } from "react";
import { Clock, Search } from "lucide-react";

export default function RecentSearches() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/api/landlord/recent-searches")
      .then((r) => r.json())
      .then((d) => setLogs(d.logs || []));
  }, []);

  if (!logs.length) {
    return (
      <div className="border rounded-xl p-6 text-gray-500 text-center">
        <Search className="w-6 h-6 mx-auto mb-2" />
        No recent searches yet.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>

      <div className="space-y-3">
        {logs.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b last:border-none"
          >
            <div>
              <p className="font-medium">{item.fullName}</p>
              <p className="text-sm text-gray-500">{item.address}</p>
            </div>

            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {item.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
