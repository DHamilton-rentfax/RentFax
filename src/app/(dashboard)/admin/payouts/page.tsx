'use client';

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/payouts");
      const data = await res.json();
      setPayouts(data.payouts || []);
      setLoading(false);
    })();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );

  const totalRevenue = payouts.reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payouts.reduce((sum, p) => sum + p.fee, 0);

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-extrabold text-[#1A2540] mb-8">Admin Payouts</h1>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-green-700">
              Total Revenue: ${totalRevenue.toFixed(2)}
            </h2>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-blue-700">
              Platform Fees: ${totalFees.toFixed(2)}
            </h2>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <ul className="divide-y divide-gray-300">
            {payouts.map((p) => (
              <li key={p.id} className="p-4 flex justify-between items-center text-lg">
                <div>
                  <span className="font-semibold">Agency: {p.agencyId}</span>
                  <span className="mx-4 text-gray-500">|</span>
                  <span>Case: {p.caseId}</span>
                </div>
                <div>
                  <span className="text-green-600">+${p.amount.toFixed(2)}</span>
                  <span className="text-red-600 ml-4">(-${p.fee.toFixed(2)})</span>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </main>
  );
}
