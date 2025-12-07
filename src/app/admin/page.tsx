import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";
import VerificationStatsChart from "@/components/dashboard/charts/VerificationStatsChart";
import ReportVolumeChart from "@/components/dashboard/charts/ReportVolumeChart";
import DisputeResolutionChart from "@/components/dashboard/charts/DisputeResolutionChart";
import PlanUsageChart from "@/components/dashboard/charts/PlanUsageChart";
import AdminFraudPanel from "@/components/dashboard/AdminFraudPanel";
import DisputeResolutionPanel from "@/components/dashboard/DisputeResolutionPanel";
import FraudSignalTable from "@/components/dashboard/FraudSignalTable";
import AuditLogViewer from "@/components/dashboard/AuditLogViewer";

export default function AdminDashboard() {
  const stats = {
    totalReports: 548,
    activeRenters: 291,
    incidents: 42,
    disputes: 8,
  };

  const verificationData = [
    { month: "Jan", verifications: 12 },
    { month: "Feb", verifications: 24 },
    { month: "Mar", verifications: 38 },
  ];

  const reportData = [
    { month: "Jan", reports: 20 },
    { month: "Feb", reports: 40 },
    { month: "Mar", reports: 60 },
  ];

  const disputeData = [
    { label: "Resolved", value: 6 },
    { label: "Pending", value: 1 },
    { label: "Rejected", value: 1 },
  ];

  const planUsageData = [
    { name: "Free", usage: 10 },
    { name: "Starter", usage: 35 },
    { name: "Pro", usage: 55 },
  ];

  return (
    <div className="space-y-6">
      <AnalyticsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VerificationStatsChart data={verificationData} />
        <ReportVolumeChart data={reportData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DisputeResolutionChart data={disputeData} />
        <PlanUsageChart data={planUsageData} />
      </div>

      <AdminFraudPanel />
      <FraudSignalTable />
      <DisputeResolutionPanel />
      <AuditLogViewer role="admin" />
    </div>
  );
}
