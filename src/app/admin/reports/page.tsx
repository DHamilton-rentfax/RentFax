"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import Filters from "./components/Filters";
import ReportTable from "./components/ReportTable";
import ChartPanel from "./components/ChartPanel";
import { Button } from "@/components/ui/button";

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({});
  const [aiSummary, setAiSummary] = useState("");

  useEffect(() => {
    async function load() {
      const action = (await import("./actions/getReports")).getReports;
      const data = await action(filters);
      setReports(data.reports);
      setAiSummary(data.aiSummary);
      setLoading(false);
    }
    load();
  }, [filters]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Report History & Analytics</h1>

      <Filters onChange={setFilters} />

      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin w-12 h-12" />
        </div>
      ) : (
        <>
          <ChartPanel data={reports} />
          <ReportTable data={reports} />
        </کاروں
      )}

      {aiSummary && (
        <div className="p-6 border rounded-lg bg-white shadow">
          <h2 className="text-xl font-semibold mb-2">AI Portfolio Summary</h2>
          <p className="whitespace-pre-line">{aiSummary}</p>
        </div>
      )}
    </div>
  );
}
