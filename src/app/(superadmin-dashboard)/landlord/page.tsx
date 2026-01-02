"use client";

import { useState } from "react";
import RecentSearches from "./components/RecentSearches";
import LandlordSummaryCards from "./components/LandlordSummaryCards";
import SearchButton from "./components/SearchButton";
import UpgradePrompt from "./components/UpgradePrompt";

export default function LandlordDashboardPage() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div className="p-8 space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[#1A2540]">Landlord Dashboard</h1>

        <SearchButton onComplete={() => setRefresh(refresh + 1)} />
      </div>

      {/* Summary */}
      <LandlordSummaryCards />

      {/* Recent Searches */}
      <RecentSearches key={refresh} />

      {/* Upgrade Prompt */}
      <UpgradePrompt />
    </div>
  );
}
