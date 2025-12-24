"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RecommendedHelpProps {
  context: string;
}

interface Faq {
  id: string;
  slug: string;
  title: string;
}

interface BacklogItem {
  id: string;
  title: string;
}

interface HelpData {
  faqs: Faq[];
  backlog: BacklogItem[];
}

export default function RecommendedHelp({ context }: RecommendedHelpProps) {
  const [data, setData] = useState<HelpData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!context) return;

    setLoading(true);
    fetch("/api/support/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context }),
    })
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load recommendations:", err);
        setLoading(false);
      });
  }, [context]);

  const hasContent = data && (data.faqs?.length > 0 || data.backlog?.length > 0);

  if (loading) {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-gray-500">Loading help...</p>
        </div>
    );
  }

  if (!hasContent) {
    return null; // Don't render anything if there are no recommendations
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
      <h2 className="font-semibold text-lg mb-3">Need help with this page?</h2>

      {/* Articles */}
      {data.faqs?.length > 0 && (
        <div className="mb-4">
          {data.faqs.map((f) => (
            <Link
              key={f.id}
              href={`/support/article/${f.slug}`}
              className="block text-blue-700 hover:underline text-sm mb-2"
            >
              {f.title}
            </Link>
          ))}
        </div>
      )}

      {/* Suggested backlog topics */}
      {data.backlog?.length > 0 && (
        <div>
          <h3 className="text-sm text-gray-600 mb-2">Topics we're working on:</h3>
          {data.backlog.map((b) => (
            <div
              key={b.id}
              className="text-xs text-gray-500 border-l-2 border-gray-300 pl-2 mb-1"
            >
              {b.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
