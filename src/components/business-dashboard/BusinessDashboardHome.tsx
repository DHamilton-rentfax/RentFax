import SummaryCards from "./SummaryCards";
import RecentSearches from "./RecentSearches";
import RecentIncidents from "./RecentIncidents";
import RecentRenters from "./RecentRenters";

export default function BusinessDashboardHome() {
  const dashboard = {}; // Removed call to getDashboardData

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

      <SummaryCards data={dashboard} />

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
