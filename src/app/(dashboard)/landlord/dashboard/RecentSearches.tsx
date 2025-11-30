"use client";

import { useEffect, useState } from "react";
import { Clock, Search } from "lucide-react";

type LogItem = {
  id: string;
  fullName?: string;
  email?: string;
  address?: string;
  timestamp?: string;
  query?: {
    fullName?: string;
    email?: string;
  };
  result?: {
    identityScore?: number;
    fraudScore?: number;
  };
};

export default function RecentSearches({ userId }: { userId: string }) {
  const [items, setItems] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `/api/landlord/dashboard?type=recent-searches&userId=${userId}`
        );
        const json = await res.json();

        // Support both shapes:
        const list =
          json.logs || json.history || [];

        setItems(list);
      } catch (e) {
        console.error("Failed to load recent searches:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [userId]);

  if (loading) {
    return (
      <div className="border rounded-xl p-6 text-center text-gray-500">
        Loading recent searches…
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="border rounded-xl p-6 text-gray-500 text-center">
        <Search className="w-6 h-6 mx-auto mb-2" />
        No recent searches yet.
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-6 bg-white">
      <h2 className="text-lg font-semibold mb-4">Recent Searches</h2>

      <div className="space-y-4">
        {items.map((item) => {
          const name =
            item.fullName ||
            item?.query?.fullName ||
            "Unknown name";

          const email =
            item.email ||
            item?.query?.email ||
            null;

          const address = item.address || null;

          const matchScore = item?.result?.identityScore;
          const fraudScore = item?.result?.fraudScore;

          return (
            <div
              key={item.id}
              className="p-4 border rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{name}</p>

                {email && (
                  <p className="text-gray-500 text-sm">{email}</p>
                )}

                {address && (
                  <p className="text-gray-500 text-sm">{address}</p>
                )}
              </div>

              <div className="text-right text-sm text-gray-500">
                {item.timestamp && (
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="w-4 h-4" /> {item.timestamp}
                  </div>
                )}

                {matchScore !== undefined && (
                  <p>Match: {matchScore}%</p>
                )}

                {fraudScore !== undefined && (
                  <p>Fraud: {fraudScore}/100</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
