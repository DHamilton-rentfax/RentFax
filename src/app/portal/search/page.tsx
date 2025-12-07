"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LookupPortal() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<any>(null);

  async function search() {
    const res = await fetch(`/api/report/search?q=${query}`);
    const data = await res.json();
    setResult(data.matches || []);
  }

  return (
    <div className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Renter Lookup Portal</h1>

      <div className="flex gap-3">
        <input
          className="border p-2 rounded-md w-full"
          placeholder="Name, email, phone, or license"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={search}>Search</Button>
      </div>

      {result && (
        <div className="space-y-3 mt-6">
          {result.length === 0 ? (
            <p>No matches found.</p>
          ) : (
            result.map((r: any) => (
              <div key={r.id} className="border p-4 rounded-md bg-muted/40">
                <p className="font-medium">{r.fullName}</p>
                <Button
                  className="mt-2"
                  onClick={() => window.location.assign(`/report/${r.id}`)}
                >
                  View Report
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
