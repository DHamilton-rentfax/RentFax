"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import CompanyBadges from "@/components/company/CompanyBadges";

export default function PublicCompanyProfile({ params }) {
  const [company, setCompany] = useState(null);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch(`/api/company/public?id=${params.companyId}`)
      .then((r) => r.json())
      .then((d) => {
        setCompany(d.company);
        setMetrics(d.metrics);
      });
  }, []);

  if (!company) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-10">

      <h1 className="text-4xl font-bold">{company.name}</h1>
      <p className="text-muted-foreground">{company.industry || "Uncategorized"}</p>

      {/* Reputation Score Preview */}
      <Card className="p-6 border-dashed bg-muted/50">
        <h2 className="text-xl font-semibold">RentFAX Score (Coming Soon)</h2>
        <p className="text-sm text-muted-foreground mt-2">
          This company is participating in the RentFAX trust model pilot.
          Scores are not visible yet.
        </p>

        <div className="mt-6 py-8 text-center">
          <span className="text-6xl font-bold opacity-40">--</span>
        </div>
      </Card>

      {/* Badges */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold">Badges</h2>
        <CompanyBadges badges={company.badges || []} />
      </Card>

      {/* Transparency Metrics */}
      {metrics && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Transparency</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Incidents</p>
              <p className="text-2xl font-bold">{metrics.totalIncidents}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Disputes Resolved</p>
              <p className="text-2xl font-bold">{metrics.disputesResolved}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Transparency Score</p>
              <p className="text-2xl font-bold">{metrics.transparencyScore}</p>
            </div>
          </div>
        </Card>
      )}

      {/* About */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold">About</h2>
        <p className="text-sm mt-2">{company.description || "No description available."}</p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Service Area</h2>
        <p className="text-sm mt-2">{company.serviceArea || "Not provided."}</p>
      </Card>

      {/* Team Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Team</h2>
          <a
            href={`/accept-invite?companyId=${params.companyId}`}
            className="bg-blue-600 text-white px-5 py-3 rounded"
          >
            Join Team
          </a>
        </div>
        <div className="grid gap-4">
          {company.team && company.team.map((m) => (
            <div className="border p-4 rounded-xl flex justify-between" key={m.id}>
              <div>
                <p className="font-semibold">{m.name || m.email}</p>
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
