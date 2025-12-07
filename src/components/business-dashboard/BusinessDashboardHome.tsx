"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import SummaryCards from "./SummaryCards";
import RecentSearches from "./RecentSearches";
import RecentIncidents from "./RecentIncidents";
import RecentRenters from "./RecentRenters";

import { getDashboardData } from "@/app/(dashboard)/business/actions/getDashboardData";

export default function BusinessDashboardHome() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const data = await getDashboardData();
      setDashboard(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 p-6">
      {/* PAGE HEADER */}
      <header>
        <h1 className="text-3xl font-bold text-[#1A2540]">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-1">
          A snapshot of your recent rental activity, searches, risks, and tools.
        </p>
      </header>

      {/* SUMMARY CARDS */}
      <SummaryCards data={dashboard} />

      {/* RECENT WIDGETS */}
      <div className="grid md:grid-cols-2 gap-6">
        <RecentSearches />
        <RecentIncidents />
      </div>

      <div className="grid md:grid-cols-1 gap-6">
        <RecentRenters />
      </div>
    </div>
  );
}
