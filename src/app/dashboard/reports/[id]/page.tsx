import { FullReport } from "@/types/report";
import FullReportView from '@/components/report/FullReportView';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/report/full-report`,
    {
      method: "POST",
      body: JSON.stringify({ renterId: params.id }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return <div className="p-6">Failed to load report.</div>;
  }

  const report: FullReport = await res.json();

  return <FullReportView report={report} />;
}
