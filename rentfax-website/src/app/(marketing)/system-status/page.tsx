"use client";

import { useEffect, useState } from "react";

type Status = "pending" | "success" | "error";

type TestResult = {
  name: string;
  status: Status;
  details?: string;
  error?: string;
};

const TEST_ORDER = [
  "Firestore",
  "Stripe",
  "Identity Check API",
  "Search API",
  "Self-Verify API",
  "Announcement Feed",
  "Blog Feed",
  "Environment Variables",
];

export default function SystemStatusPage() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [running, setRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<Status>("pending");

  const runDiagnostics = async () => {
    setRunning(true);
    setResults({});
    setOverallStatus("pending");

    try {
      const response = await fetch("/api/system/test");
      if (!response.ok) {
        throw new Error("Failed to run system tests");
      }
      const data = await response.json();

      if (data.results) {
        setResults(data.results);
        const hasErrors = Object.values(data.results).some(
          (r: any) => r.status === "error"
        );
        setOverallStatus(hasErrors ? "error" : "success");
      }
    } catch (error: any) {
      setOverallStatus("error");
      setResults((prev) => ({
        ...prev,
        "API Error": {
          name: "API Communication",
          status: "error",
          error: error.message || "Could not connect to the test API.",
        },
      }));
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case "success":
        return "✓";
      case "error":
        return "✗";
      default:
        return "…";
    }
  };

  const sortedResults = TEST_ORDER.map(
    (testName) =>
      results[testName] || { name: testName, status: "pending" }
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            System Diagnostics
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Live status of all core RentFAX services.
          </p>
        </div>

        <div className="mt-10 bg-white shadow-xl rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Overall Status
              </h2>
              <p
                className={`mt-1 font-bold text-lg ${getStatusColor(
                  overallStatus
                )}`}
              >
                {overallStatus === "success" && "All Systems Operational"}
                {overallStatus === "error" && "Some Systems Failing"}
                {overallStatus === "pending" && "Testing in Progress..."}
              </p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={running}
              className="px-5 py-2.5 rounded-lg bg-[#D4AF37] text-[#1A2540] font-semibold hover:bg-[#e8c557] disabled:bg-gray-300 disabled:cursor-not-allowed transition"
            >
              {running ? "Running..." : "Re-run Diagnostics"}
            </button>
          </div>

          <ul className="divide-y divide-gray-200">
            {sortedResults.map((result) => (
              <li key={result.name} className="px-6 py-5">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-800">
                    {result.name}
                  </p>
                  <div
                    className={`flex items-center gap-2 text-lg font-bold ${getStatusColor(
                      result.status
                    )}`}
                  >
                    <span>{getStatusIcon(result.status)}</span>
                    <span className="capitalize">{result.status}</span>
                  </div>
                </div>
                {result.details && (
                  <p className="mt-1 text-sm text-gray-600">{result.details}</p>
                )}
                {result.error && (
                  <p className="mt-1 text-sm font-mono bg-red-50 text-red-700 p-2 rounded-md">
                    {result.error}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Last checked: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}