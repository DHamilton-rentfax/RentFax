"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function HelpCenterSearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    if (!query) return;
    performSearch(query);
  }, [query]);

  async function performSearch(q: string) {
    setLoading(true);

    try {
      const res = await fetch("/api/help/search", {
        method: "POST",
        body: JSON.stringify({ query: q }),
      });

      const data = await res.json();
      const articles = data.results || [];

      setResults(articles);
      setNoResults(articles.length === 0);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold">Search Results</h1>
      <p className="text-gray-600 mt-2 mb-8">
        Showing results for: <span className="font-semibold">{query}</span>
      </p>

      {loading && <p className="text-gray-600">Searching...</p>}

      {!loading && noResults && (
        <div className="p-6 border rounded-xl bg-gray-50">
          <h2 className="text-xl font-bold mb-2">No results found</h2>
          <p className="text-gray-600 mb-4">
            We couldn't find any help articles for your search. Try different
            keywords, or contact support.
          </p>

          <Link
            href="/dashboard/chat"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Chat With Support
          </Link>
        </div>
      )}

      {/* RESULTS LIST */}
      <div className="space-y-6">
        {results.map((article) => (
          <Link
            key={article.id}
            href={`/help-center/article/${article.id}`}
            className="block p-6 border rounded-xl hover:bg-gray-50 transition"
          >
            <h3 className="text-xl font-semibold">{article.title}</h3>
            <p className="text-gray-700 mt-2 line-clamp-2">
              {article.shortAnswer}
            </p>

            <div className="flex gap-2 mt-3">
              {article.categories?.slice(0, 2).map((cat: string) => (
                <span
                  key={cat}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs"
                >
                  {cat}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}