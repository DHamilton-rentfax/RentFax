"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function HousingDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/housing/dashboard")
      .then((r) => r.json())
      .then((d) => setData(d));
  }, []);

  if (!data) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-semibold">Property Portfolio</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-5"><p className="text-sm">Properties</p><p className="text-3xl">{data.properties}</p></Card>
        <Card className="p-5"><p className="text-sm">Units</p><p className="text-3xl">{data.units}</p></Card>
        <Card className="p-5"><p className="text-sm">Tenants</p><p className="text-3xl">{data.tenants}</p></Card>
      </div>
    </div>
  );
}
