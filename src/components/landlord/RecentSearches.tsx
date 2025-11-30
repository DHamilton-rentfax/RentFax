
"use client";

import { useEffect, useState } from "react";
import { Loader2, Search, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export default function RecentSearches() {
  const [loading, setLoading] = useState(true);
  const [searches, setSearches] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/landlord/recent-searches");
        const data = await res.json();
        if (res.ok) {
          setSearches(data.searches || []);
        } else {
          console.error("Failed to fetch recent searches:", data.error);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-500" />
      </div>
    );

  if (searches.length === 0)
    return (
      <div className="p-6 text-gray-500 text-center border-2 border-dashed rounded-xl">
        <Search className="w-10 h-10 mx-auto text-gray-400 mb-2" />
        <h3 className="font-semibold">No Recent Searches</h3>
        <p className="text-sm">Your recent renter lookups will appear here.</p>
      </div>
    );

  return (
    <div className="bg-white p-6 rounded-xl shadow border space-y-4">
      <h2 className="text-xl font-bold text-[#1A2540]">Recent Searches</h2>

      {searches.map((s) => (
        <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-semibold">{s.fullName}</p>
            <p className="text-sm text-gray-600">{s.email || s.phone}</p>

            <p className="text-sm mt-1">
              Status:{" "}
              {s.status === "FOUND_IN_RENTFAX" && (
                <span className="text-green-600 font-semibold">Found in RentFAX</span>
              )}
              {s.status === "PUBLIC_MATCH" && (
                <span className="text-blue-600 font-semibold">Public Match ({Math.round((s.matchConfidence || 0)*100)}%)</span>
              )}
              {s.status === "NO_MATCH" && (
                <span className="text-gray-600 font-semibold">No Match</span>
              )}
            </p>
          </div>

          <div className="flex gap-2">
            {s.renterId && (
              <Link
                href={`/report/${s.renterId}`}
                className="px-3 py-1 rounded bg-green-600 text-white text-sm"
              >
                View Report
              </Link>
            )}

            {!s.renterId && s.status !== "FOUND_IN_RENTFAX" && (
              <Link
                href={`/verify/${s.id}`}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              >
                Continue Verification
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
