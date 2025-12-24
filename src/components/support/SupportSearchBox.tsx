"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SupportSearchBox({ role }: { role: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function runSearch(q: string) {
    setQuery(q);
    if (q.length < 3) {
      setResults([]);
      return;
    }

    const res = await fetch("/api/support/search/smart", {
      method: "POST",
      body: JSON.stringify({ query: q }),
    });

    const data = await res.json();
    setResults(data.results);
  }

  return (
    <div className="relative w-full max-w-xl">
      <input
        className="border rounded-lg p-3 w-full pl-10"
        placeholder="Search support articles…"
        value={query}
        onChange={(e) => runSearch(e.target.value)}
      />

      <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />

      {results.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border rounded-lg shadow-xl z-10">
          {results.map((r) => (
            <a
              key={r.articleId}
              href={`/support/article/${r.slug}`}
              className="block p-3 hover:bg-gray-50"
            >
              <div className="font-medium">{r.title}</div>
              <div className="text-sm text-gray-500">{r.keywords?.slice(0,3).join(", ")}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
