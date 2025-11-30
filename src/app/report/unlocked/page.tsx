"use client";

import { useEffect, useState } from "react";
import { ReportViewer } from "@/components/reports/ReportViewer"; // Assuming you have a generic ReportViewer
import { Loader2, ShieldAlert } from "lucide-react";

// Mock API fetch function
async function fetchReportFromSession(sessionId) {
    if (!sessionId) return { error: "Invalid session ID." };

    console.log(`Fetching report for session: ${sessionId}`);
    // In a real app, this would hit an API endpoint that validates the session
    // and securely returns the report data.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Mock successful data fetch
    return {
        report: {
            id: 'rep_mock_123',
            renterName: 'Jane Doe',
            riskScore: 78,
            summary: 'A comprehensive look at the renter profile.',
            // Add other necessary report fields here
        },
        shared: true,
    };
    
    // Mock error state
    // return { error: "The access link has expired or is invalid." };
}

export default function UnlockedPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id");

    if (!sessionId) {
        setError("No session ID provided.");
        setLoading(false);
        return;
    }

    fetchReportFromSession(sessionId).then(result => {
      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="mt-4 text-lg text-gray-700">Unlocking your report...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
              <ShieldAlert className="w-16 h-16 text-red-500" />
              <h2 className="mt-4 text-2xl font-bold text-red-700">Access Denied</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <a href="/report/search" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Return to Search
              </a>
          </div>
      );
  }

  // You need a ReportViewer component to render the actual report data.
  // This is a placeholder for where that component would go.
  return data ? 
    <div className="p-4 md:p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Renter Report for {data.report.renterName}</h2>
        <p className="mb-4 text-sm text-gray-500">This is a shared, view-only report with limited access.</p>
        {/* Assuming ReportViewer can handle a 'shared' prop */}
        {/* <ReportViewer report={data.report} shared={data.shared} /> */}
        <div className="p-8 bg-white rounded-lg shadow-md">
            <h3 className="font-bold text-lg">Report Details</h3>
            <p>ID: {data.report.id}</p>
            <p>Risk Score: {data.report.riskScore}</p>
            <p>Summary: {data.report.summary}</p>
        </div>
    </div>
    : null;
}
