"use client";

import { useEffect, useState } from "react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/companies/list")
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-semibold">Companies</h1>

      <div className="grid gap-4">
        {companies.map((c) => (
          <div key={c.id} className="p-4 border rounded-lg shadow-sm bg-card">
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-muted-foreground">{c.email}</p>
            <p className="text-sm">Plan: {c.plan}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
