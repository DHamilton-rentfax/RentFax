'use client';

import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function CompanyBillingPage() {
  const { user } = useAuth();
  const { data, error } = useSWR(
    user ? `/api/billing/insights?uid=${user.uid}` : null,
    fetcher
  );

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Billing & Usage</h1>

      <Card className="p-6 border-dashed bg-yellow-50">
        <h2 className="text-xl font-semibold">RentFAX Score Preview (Not for Decision-Making)</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Used only for internal modeling, not for screening.
        </p>
      </Card>

      {error && <p className="text-red-500 mt-6">Failed to load billing insights.</p>}
      {!data && !error && <p className="mt-6">Loading billing insights...</p>}

      {data && (
        <div className="mt-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Current Usage</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="font-semibold">Verifications</p>
                <p>{data.usage.verifications || 0}</p>
              </div>
              <div>
                <p className="font-semibold">Reports</p>
                <p>{data.usage.reports || 0}</p>
              </div>
              <div>
                <p className="font-semibold">Searches</p>
                <p>{data.usage.searches || 0}</p>
              </div>
            </div>
          </Card>

          {data.level !== "none" && (
            <div className="rounded-lg border border-gray-300 bg-yellow-50 p-4 mt-6">
              <p className="font-semibold text-gray-900 text-sm">
                Recommended Action
              </p>

              {data.rec.recommendations.map((r: any, idx: number) => (
                <p key={idx} className="text-xs text-gray-700 mt-2">
                  • {r.message}
                </p>
              ))}

              <a
                href="/pricing"
                className="inline-block mt-3 px-4 py-2 bg-gray-900 text-white text-xs rounded-full"
              >
                View Upgrade Options
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
