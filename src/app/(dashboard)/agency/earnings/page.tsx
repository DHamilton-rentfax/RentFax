'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function EarningsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/agency/payouts");
      const data = await res.json();
      setPayouts(data.payouts || []);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );

  const totalEarnings = payouts.reduce((sum, p) => sum + p.amount - p.fee, 0);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">Earnings</h1>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">
            Total Earned: ${totalEarnings.toFixed(2)}
          </h2>

          <ul className="divide-y divide-gray-200">
            {payouts.map((p) => (
              <li key={p.id} className="py-3 text-sm flex justify-between">
                <span>
                  Case #{p.caseId} – ${p.amount.toFixed(2)}
                </span>
                <span className="text-gray-500">
                  Fee: ${p.fee.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}