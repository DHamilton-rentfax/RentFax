"use client";

import { useEffect, useState } from "react";

export default function FullReportPage({ params }: { params: { renterId: string } }) {
  const { renterId } = params;
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/report/full?renterId=${renterId}`)
      .then((r) => r.json())
      .then(setReport);
  }, [renterId]);

  if (!report) return <div className="p-8">Loading report...</div>;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-semibold">Full Renter Report</h1>
      <pre className="bg-gray-100 p-4 rounded-xl text-sm">
        {JSON.stringify(report, null, 2)}
      </pre>
    </div>
  );
}
