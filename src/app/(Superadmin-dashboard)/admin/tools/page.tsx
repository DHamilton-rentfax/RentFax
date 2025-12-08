
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

export default function AdminToolsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<any>({
    identityCheckPrice: 4.99,
    fullReportPrice: 20,
    searchCredit50: 149,
    searchCredit200: 299,
  });

  // Load pricing
  useEffect(() => {
    async function load() {
      // NOTE: There is no GET endpoint for admin-tools yet.
      // This is a placeholder for future implementation.
      // For now, it will use the default state.
    }
    load();
  }, []);

  async function runAction(action: string, payload: any = null) {
    setLoading(true);
    try {
      const res = await fetch("/api/admin-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          payload,
          uid: user?.uid,
        }),
      });
      const json = await res.json();
      alert(JSON.stringify(json, null, 2));
    } catch (err) {
       alert('An error occurred. Check the console.');
       console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  async function savePricing() {
    await runAction("update_pricing", pricing);
  }

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Super Admin Controls</h1>

      {/* Verification Actions */}
      <div className="space-y-3 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold">Verification Management</h2>

        <button
          onClick={() => runAction("approve_all_pending")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg"
        >
          Approve All Pending
        </button>

        <button
          onClick={() => runAction("reject_all_pending")}
          className="px-4 py-2 bg-red-600 text-white rounded-lg ml-2"
        >
          Reject All Pending
        </button>
      </div>

      {/* Pricing Editor */}
      <div className="space-y-3 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold">Live Pricing Controls</h2>

        {["identityCheckPrice", "fullReportPrice", "searchCredit50", "searchCredit200"].map(
          (key) => (
            <div key={key} className="flex items-center gap-4">
              <label className="w-48">{key}</label>
              <input
                type="number"
                className="border px-3 py-2 rounded-lg w-40"
                value={pricing[key]}
                onChange={(e) =>
                  setPricing({ ...pricing, [key]: Number(e.target.value) })
                }
              />
            </div>
          )
        )}

        <button
          onClick={savePricing}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Save Pricing
        </button>
      </div>

      {/* Fraud + Graph Tools */}
      <div className="space-y-3 p-6 bg-white rounded-xl shadow">
        <h2 className="text-xl font-semibold">Platform Intelligence Controls</h2>

        <button
          onClick={() => runAction("rescan_fraud")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Trigger Fraud Re-Scan
        </button>

        <button
          onClick={() => runAction("rebuild_graphs")}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg ml-2"
        >
          Rebuild Identity Graphs
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-gray-700">
          <Loader2 className="animate-spin" /> Processing…
        </div>
      )}
    </div>
  );
}
