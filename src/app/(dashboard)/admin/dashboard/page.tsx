'use client';

import AnalyticsOverview from "@/components/admin/dashboard/AnalyticsOverview";
import DisputeResolutionPanel from "@/components/admin/dashboard/DisputeResolutionPanel";
import FraudSignalTable from "@/components/admin/dashboard/FraudSignalTable";
import RealTimeNotifications from "@/components/admin/dashboard/RealTimeNotifications";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Super Admin Dashboard</h1>
      <AnalyticsOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <DisputeResolutionPanel />
          <FraudSignalTable />
        </div>
        <div className="space-y-8">
          <RealTimeNotifications />
        </div>
      </div>
    </div>
  );
}
