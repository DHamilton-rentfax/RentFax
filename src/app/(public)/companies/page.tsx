"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function CompanyDirectoryPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("ALL");

  useEffect(() => {
    fetch("/api/company/directory")
      .then(r => r.json())
      .then(d => setCompanies(d.companies || []));
  }, []);

  const filtered = companies.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());

    const matchIndustry =
      industry === "ALL" ? true : c.industry?.includes(industry);

    return matchSearch && matchIndustry;
  });

  return (
    <div className="max-w-5xl mx-auto p-10 space-y-8">
      <h1 className="text-3xl font-semibold">Find Trusted Rental Companies</h1>

      <div className="flex gap-4 items-center">
        <input
          className="border p-3 rounded w-80"
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Industry filter */}
        <select
          className="border p-3 rounded"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        >
          <option value="ALL">All Industries</option>
          <option value="HOUSING">Housing / Landlords</option>
          <option value="CAR_RENTAL">Vehicle Rentals</option>
          <option value="EQUIPMENT">Equipment Rentals</option>
          <option value="STORAGE">Storage Units</option>
          <option value="HOSPITALITY">Short-Term Rentals</option>
          <option value="COWORKING">Co-working</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filtered.map((c) => (
          <Card
            key={c.companyId}
            className="p-6 cursor-pointer hover:bg-muted transition"
            onClick={() =>
              window.location.href = `/company/${c.companyId}`
            }
          >
            <h3 className="text-xl font-semibold">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.industry || "No industry listed"}</p>

            <div className="mt-4 space-y-1">
              {c.verified && (
                <p className="text-green-600 text-sm font-medium">Verified Business</p>
              )}
              <p className="text-sm text-muted-foreground">
                Reputation Score: <span className="italic">Coming Soon</span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}