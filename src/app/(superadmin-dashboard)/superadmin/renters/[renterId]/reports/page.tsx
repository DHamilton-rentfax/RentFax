import Link from "next/link";
import { getReportsForRenter } from "./actions/getReports";

export default async function RenterReportsPage({
  params,
}: {
  params: { renterId: string };
}) {
  const reports = await getReportsForRenter(params.renterId);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Renter Reports</h1>

      {reports.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No reports found for this renter.
        </p>
      )}

      <div className="space-y-3">
        {reports.map((report) => (
          <Link
            key={report.id}
            href={`/admin/renters/${params.renterId}/reports/${report.id}`}
            className="block rounded border p-4 hover:bg-muted transition"
          >
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{report.title ?? "Rental Report"}</p>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span className="text-xs rounded bg-slate-100 px-2 py-1">
                {report.status ?? "open"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
