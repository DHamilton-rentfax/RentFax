
"use client";
import { useEffect, useState } from "react";

export default function MarketplacePage() {
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/market/packages")
      .then((res) => res.json())
      .then(setPackages);
  }, []);

  const handleBuy = async (pkgId: string) => {
    const res = await fetch("/api/market/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId: "enterprise_test", packageId: pkgId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">RentFAX Data Marketplace</h1>
      <p className="text-slate-600 mb-6">
        Access anonymized renter risk trends, fraud analytics, and AI market insights.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="border rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg mb-1">{pkg.title}</h2>
            <p className="text-sm text-slate-600 mb-3">{pkg.description}</p>
            <p className="font-bold text-slate-900 mb-4">${pkg.price.toFixed(2)}</p>
            <button
              onClick={() => handleBuy(pkg.id)}
              className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600"
            >
              Purchase Access
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
