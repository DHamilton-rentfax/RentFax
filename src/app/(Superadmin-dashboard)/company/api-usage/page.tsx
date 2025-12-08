"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function ApiUsagePage() {
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an authenticated request
    fetch("/api/internal/billing/api-usage")
      .then((res) => res.json())
      .then((data) => {
        setUsage(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-10">Loading API usage...</p>;

  if (!usage) return <p className="p-10">Could not load API usage data.</p>

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-semibold">API Usage</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(usage).map(([key, value]: any) => (
          <Card key={key} className="p-4">
            <h2 className="text-xl capitalize">{key.replace(/([A-Z])/g, ' $1')}</h2>
            <p className="text-3xl font-semibold">{value.toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
