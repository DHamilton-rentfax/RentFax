"use client";

import { DownloadReportButton } from "@/components/reports/DownloadReportButton";

export default function MyReport() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">My Universal RentFAX Report</h1>

      <DownloadReportButton renterId="me" landlordId="me" />
    </div>
  );
}
