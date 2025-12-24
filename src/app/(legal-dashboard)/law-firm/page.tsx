"use client";

import { useEffect, useState } from "react";

export default function LawFirmDashboard() {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/law-firm/cases")
      .then(r => r.json())
      .then(d => setCases(d.cases));
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Assigned Legal Cases</h2>

      {cases.map(c => (
        <div key={c.caseId} className="border bg-white p-4 mb-3">
          <p><strong>Case:</strong> {c.caseId}</p>
          <p>Status: {c.status}</p>
          <a
            className="text-blue-600 underline"
            href={`/law-firm/case/${c.caseId}`}
          >
            Review Case →
          </a>
        </div>
      ))}
    </div>
  );
}
