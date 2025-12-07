import { getRenterData } from "@/app/actions/get-renter-data";
import { RenterSummary } from "@/components/report/RenterSummary";
import { RiskScore } from "@/components/report/RiskScore";
import { BehavioralInsights } from "@/components/report/BehavioralInsights";
import { IncidentTimeline } from "@/components/report/IncidentTimeline";
import { FraudSignals } from "@/components/report/FraudSignals";
import { Attachments } from "@/components/report/Attachments";
import UnauthorizedDriverForm from "@/components/UnauthorizedDriverForm";
import * as React from "react";

// This is a placeholder for the actual data fetching logic
// which will be implemented after the Stripe payment flow is in place.
async function getReportData(reportId: string) {
  // For now, we'll use a mock renter ID. In the real implementation,
  // the reportId would be used to look up the associated renter.
  const mockRenterId = "some-renter-id";
  return await getRenterData(mockRenterId);
}

export default async function ReportPage({
  params,
}: {
  params: { reportId: string };
}) {
  const reportData = await getReportData(params.reportId);

  if (!reportData) {
    return (
      <div className="text-center py-10">
        Report not found or access denied.
      </div>
    );
  }

  const { renter, incidents, disputes } = reportData;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 font-sans">
      <header className="flex justify-between items-center pb-6 border-b-2 border-gray-200 mb-8">
        <h1 className="text-4xl font-bold text-gray-800">RentFAX Report</h1>
        {/* Optional: Add a logo or other branding here */}
      </header>

      <div className="space-y-12">
        <RenterSummary renter={renter} />
        <RiskScore incidents={incidents} disputes={disputes} />
        <BehavioralInsights incidents={incidents} />
        <FraudSignals renter={renter} />
        <IncidentTimeline incidents={incidents} />
        <Attachments incidents={incidents} />
        <UnauthorizedDriverForm reportId={params.reportId} />
      </div>

      <footer className="text-center mt-12 text-sm text-gray-500">
        <p>Report Generated on {new Date().toLocaleDateString()}</p>
        <p>&copy; {new Date().getFullYear()} RentFAX. All rights reserved.</p>
      </footer>
    </div>
  );
}
