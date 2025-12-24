"use client";

import { useEffect, useState } from "react";

type HealthStatus = "ok" | "warn" | "fail" | "loading";

type HealthItem = {
  name: string;
  path: string;
  status: HealthStatus;
  message?: string;
};

const ENDPOINTS: { name: string; path: string }[] = [
  { name: "Search API", path: "/api/renters/search" },
  { name: "Identity Checkout", path: "/api/checkout/identity" },
  { name: "Verification Route", path: "/verify/test-token" },
  { name: "Signup Page", path: "/signup" },
  { name: "Login Page", path: "/login" },
];

export default function BetaHealthPage() {
  const [items, setItems] = useState<HealthItem[]>(
    ENDPOINTS.map((e) => ({
      ...e,
      status: "loading",
    }))
  );

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const results = await Promise.all(
        ENDPOINTS.map(async (endpoint) => {
          try {
            const res = await fetch(endpoint.path, {
              method: "GET",
              cache: "no-store",
            });

            // 200–299 → OK
            if (res.ok) {
              return {
                ...endpoint,
                status: "ok" as HealthStatus,
                message: `OK (${res.status})`,
              };
            }

            // Expected reachable states
            if ([400, 401, 403, 404].includes(res.status)) {
              return {
                ...endpoint,
                status: "warn" as HealthStatus,
                message: `Reachable (${res.status})`,
              };
            }

            // Unexpected HTTP error
            return {
              ...endpoint,
              status: "fail" as HealthStatus,
              message: `Error (${res.status})`,
            };
          } catch (err: any) {
            return {
              ...endpoint,
              status: "fail" as HealthStatus,
              message: "Network error",
            };
          }
        })
      );

      if (!cancelled) {
        setItems(results);
      }
    }

    runChecks();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="p-6 max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">🧪 Beta Health Dashboard</h1>
      <p className="text-sm text-muted-foreground">
        This dashboard verifies that core routes are reachable. Auth-protected
        or gated routes are expected to return warnings.
      </p>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded border p-3"
          >
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-xs text-muted-foreground">
                {item.path}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <StatusPill status={item.status} />
              <span className="text-xs text-muted-foreground">
                {item.message}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: HealthStatus }) {
  const map: Record<HealthStatus, string> = {
    loading: "bg-gray-200 text-gray-700",
    ok: "bg-green-100 text-green-800",
    warn: "bg-yellow-100 text-yellow-800",
    fail: "bg-red-100 text-red-800",
  };

  const label: Record<HealthStatus, string> = {
    loading: "Loading",
    ok: "OK",
    warn: "Reachable",
    fail: "Fail",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium ${map[status]}`}
    >
      {label[status]}
    </span>
  );
}
