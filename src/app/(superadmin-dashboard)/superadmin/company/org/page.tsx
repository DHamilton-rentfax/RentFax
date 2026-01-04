"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export default function OrgAdminPage() {
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/org/units").then(r => r.json()).then(d => setUnits(d.units));
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold mb-6">Organization Structure</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {units.map(u => (
          <Card key={u.id} className="p-5">
            <h2 className="text-xl font-semibold">{u.name}</h2>
            <p className="text-sm">{u.description}</p>

            <Link 
              href={`/dashboard/company/org/${u.id}`}
              className="text-blue-500 text-sm underline mt-3 block"
            >
              Manage Unit
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
