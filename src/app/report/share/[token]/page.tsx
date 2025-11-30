import { FullReport } from "@/types/report";
import FullReportView from '@/components/report/FullReportView';

export default async function Page({
  params,
}: {
  params: { token: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/report/share/${params.token}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <div className="p-6">Invalid or expired link.</div>;
  }

  const data = await res.json();

  // data.renter might not exist
  if (!data.renter) {
    return <div className="p-6">No data available.</div>;
  }

  const fullReport: FullReport = data.renter.report;

  return <FullReportView report={fullReport} />;
}
