'use client';

import { useEffect, useState } from "react";

type Summary = {
  topArticles: { id: string; articleTitle: string; views: number }[];
  topCategories: { id: string; categoryName: string; views: number }[];
  searchCount: number;
  failedSearchCount: number;
  failedSearchRate: number;
  helpfulYes: number;
  helpfulNo: number;
};

export default function SupportAnalyticsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/support/analytics/summary")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8">Loading support analytics...</div>;
  }

  if (!data) {
    return <div className="p-8">No analytics data yet.</div>;
  }

  const { 
    topArticles,
    topCategories,
    searchCount,
    failedSearchCount,
    failedSearchRate,
    helpfulYes,
    helpfulNo,
  } = data;

  const totalVotes = helpfulYes + helpfulNo;

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-semibold">Support Analytics</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Searches (7d)" value={searchCount} />
        <StatCard label="Failed Searches (7d)" value={failedSearchCount} />
        <StatCard label="Failed Search Rate" value={`${failedSearchRate}%`} />
        <StatCard label="Helpfulness Votes" value={totalVotes} />
      </div>

      {/* Helpfulness breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Helpfulness Feedback</h2>
          <p className="text-sm text-gray-600 mb-4">
            Based on “Was this helpful?” votes in the last 7 days.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>👍 Yes</span>
              <span>{helpfulYes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>👎 No</span>
              <span>{helpfulNo}</span>
            </div>
          </div>
        </div>

        {/* TOP ARTICLES */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Top Articles (7d)</h2>
          <ul className="space-y-2 text-sm">
            {topArticles.map((a) => (
              <li key={a.id} className="flex justify-between">
                <span className="truncate max-w-[200px]" title={a.articleTitle}>
                  {a.articleTitle}
                </span>
                <span>{a.views}</span>
              </li>
            ))}
            {topArticles.length === 0 && (
              <li className="text-gray-500 text-sm">No data yet.</li>
            )}
          </ul>
        </div>

        {/* TOP CATEGORIES */}
        <div className="border rounded-xl p-4">
          <h2 className="font-semibold mb-2">Top Categories (7d)</h2>
          <ul className="space-y-2 text-sm">
            {topCategories.map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.categoryName}</span>
                <span>{c.views}</span>
              </li>
            ))}
            {topCategories.length === 0 && (
              <li className="text-gray-500 text-sm">No data yet.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-xs uppercase text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
