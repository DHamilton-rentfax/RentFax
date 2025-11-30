'use client';
import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, AlertCircle, Settings } from "lucide-react";

export default function BillingSummary({ userEmail }: { userEmail: string }) {
  const [billing, setBilling] = useState<any>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    if (!userEmail) return;
    fetch("/api/billing/subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail }),
    })
      .then((res) => res.json())
      .then(setBilling)
      .catch(console.error);
  }, [userEmail]);

  const handleManageBilling = async () => {
    try {
      setLoadingPortal(true);
      const res = await fetch("/api/billing/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Unable to load billing portal.");
    } catch (err) {
      console.error(err);
      alert("Error opening billing portal.");
    } finally {
      setLoadingPortal(false);
    }
  };

  if (!billing)
    return <div className="animate-pulse text-gray-400">Loading billing info...</div>;

  const statusColor =
    billing.status === "active"
      ? "text-emerald-600"
      : billing.status === "canceled"
      ? "text-red-600"
      : "text-gray-500";

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-500" /> Current Plan
        </h2>
        <span className={`font-medium ${statusColor}`}>
          {billing.status === "active" ? (
            <CheckCircle2 className="inline w-4 h-4 mr-1" />
          ) : (
            <AlertCircle className="inline w-4 h-4 mr-1" />
          )}
          {billing.status}
        </span>
      </div>

      <div className="text-gray-700 space-y-2">
        <p>
          <strong>Plan:</strong> {billing.plan}
        </p>
        <p>
          <strong>Amount:</strong> ${billing.amount} /{" "}
          {billing.plan.includes("One-Time") ? "One-Time" : "month"}
        </p>
        {billing.renewsOn && (
          <p>
            <strong>Renews on:</strong>{" "}
            {new Date(billing.renewsOn).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={handleManageBilling}
          disabled={loadingPortal}
          className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          {loadingPortal ? "Loading..." : "Manage Billing"}
        </button>

        <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
          View Add-Ons
        </button>
      </div>
    </div>
  );
}
