"use client";

import { useEffect, useState } from "react";

type CaseAssignment = {
  caseId: string;
  reportId: string;
  status: string;
  createdAt: string;
};

export default function CollectionAgencyDashboard() {
  const [cases, setCases] = useState<CaseAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      // This is a placeholder. In a real app, you'd get the
      // partnerOrgId from the user's session/token.
      const res = await fetch("/api/agency/cases");
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases);
      }
      setLoading(false);
    }

    loadCases();
  }, []);

  if (loading) {
    return <p>Loading assigned cases…</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Assigned Cases</h2>

      {cases.length === 0 ? (
        <p className="text-gray-600">No cases assigned.</p>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c.caseId}
              className="bg-white border rounded p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium">Case #{c.caseId}</p>
                <p className="text-sm text-gray-500">
                  Status: {c.status}
                </p>
              </div>

              <a
                href={`/collection-agency/case/${c.caseId}`}
                className="text-blue-600 hover:underline"
              >
                View Case →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
