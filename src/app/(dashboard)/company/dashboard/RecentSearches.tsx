'use client';

import { useEffect, useState } from "react";
import { Loader2, Clock, ArrowRight, AlertTriangle } from "lucide-react";

export default function RecentSearches({ userId }: { userId: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/landlord/dashboard?userId=${userId}`);
      const data = await res.json();
      setHistory(data.history || []);
      setLoading(false);
    }
    load();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center gap-2 text-gray-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading search history...
      </div>
    );

  if (history.length === 0)
    return (
      <p className="text-gray-400">You have no recent renter searches.</p>
    );

  return (
    <div className="space-y-4">
      {history.map((entry) => (
        <div
          key={entry.id}
          className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center"
        >
          <div>
            <p className="text-white font-medium">
              {entry.payload.firstName} {entry.payload.lastName}
            </p>
            <p className="text-gray-400 text-sm">
              {new Date(entry.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {entry.resultPreview.flagged && (
              <AlertTriangle className="text-yellow-400 w-5 h-5" />
            )}

            <span className="text-sm text-gray-300">
              Matches: {entry.resultPreview.matchCount}
            </span>

            {entry.resultPreview.score !== null && (
              <span className="text-sm text-blue-300">
                Score: {entry.resultPreview.score}
              </span>
            )}

            <a
              href="/search/renter"
              onClick={() =>
                sessionStorage.setItem(
                  "renter-search-result",
                  JSON.stringify(entry)
                )
              }
              className="text-blue-400 hover:text-blue-300"
            >
              <ArrowRight />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
