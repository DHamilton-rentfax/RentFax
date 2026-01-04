'use client';

import { useEffect, useState } from "react";

export function PublicReportViewer({ reportId }: { reportId: string }) {
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/reports/${reportId}/public`);
        if (!res.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!reportData) return <div>Report not found</div>;

  return (
    <div>
      <h1>Public Report</h1>
      <p>Renter Name: {reportData.renterName}</p>
      <p>Risk Score: {reportData.riskScore}</p>
      {/* Add other fields as needed */}
    </div>
  );
}
