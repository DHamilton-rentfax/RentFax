"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function CompanyUsagePage() {
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState<any>(null);
  const [limits, setLimits] = useState<any>(null);
  const [warnings, setWarnings] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/billing/usage");
        const json = await res.json();

        setUsage(json.usage);
        setLimits(json.limits);
        setWarnings(json.warnings || []);
      } catch {
        console.error("Failed to load usage");
      }
      setLoading(false);
    }

    load();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-40 text-gray-600">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold">Usage Overview</h1>

      {/* Soft Limit Warnings */}
      {warnings.length > 0 &&
        warnings.map((w, idx) => (
          <div
            key={idx}
            className="rounded-lg bg-yellow-50 border border-yellow-200 p-3 text-sm text-yellow-700"
          >
            ⚠ {w.event}: {w.percent}% of your limit used.
          </div>
        ))}

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(usage || {}).map((event) => (
          <div
            key={event}
            className="border rounded-lg p-5 bg-white shadow-sm"
          >
            <p className="text-sm font-medium text-gray-600">
              {event}
            </p>
            <p className="text-2xl font-bold mt-1">
              {usage[event]}
            </p>
            {limits[event] !== Infinity && (
              <p className="text-xs text-gray-500 mt-1">
                Limit: {limits[event]}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Upgrade Button */}
      <a
        href="/pricing"
        className="inline-block px-5 py-2 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black"
      >
        Upgrade Plan
      </a>
    </div>
  );
}
