// src/app/(dashboard)/reports/[reportNameId]/public/page.tsx

import { notFound } from "next/navigation";
import { adminDb } from "@/firebase/server";

type PageProps = {
  params: {
    reportNameId: string;
  };
};

export default async function PublicReportPage({ params }: PageProps) {
  const { reportNameId } = params;

  /* ----------------------------------------
     FETCH REPORT (READ-ONLY, PUBLIC SAFE)
  ---------------------------------------- */
  const reportSnap = await adminDb
    .collection("reports")
    .doc(reportNameId)
    .get();

  if (!reportSnap.exists) {
    notFound();
  }

  const report = reportSnap.data();

  /* ----------------------------------------
     OPTIONAL: HARD PUBLIC SAFETY CHECK
     (recommended even if currently unused)
  ---------------------------------------- */
  if (report?.isPublic !== true) {
    notFound();
  }

  /* ----------------------------------------
     SELECTIVELY EXPOSE FIELDS
     NEVER SPREAD THE FULL DOCUMENT
  ---------------------------------------- */
  const publicReport = {
    renterName: report?.renterName ?? "Unknown",
    riskScore: report?.riskScore ?? null,
    riskLevel: report?.riskLevel ?? "unknown",
    summary: report?.publicSummary ?? null,
    createdAt: report?.createdAt?.toDate?.() ?? null,
    updatedAt: report?.updatedAt?.toDate?.() ?? null,
  };

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          RentFAX Public Report
        </h1>
        <p className="text-sm text-muted-foreground">
          This is a limited public view of a renter screening report.
        </p>
      </header>

      <section className="rounded-lg border p-6 space-y-4">
        <div>
          <span className="text-xs uppercase text-muted-foreground">
            Renter
          </span>
          <p className="text-lg font-medium">{publicReport.renterName}</p>
        </div>

        <div>
          <span className="text-xs uppercase text-muted-foreground">
            Risk Score
          </span>
          <p className="text-lg font-medium">
            {publicReport.riskScore !== null
              ? publicReport.riskScore
              : "Unavailable"}
          </p>
        </div>

        <div>
          <span className="text-xs uppercase text-muted-foreground">
            Risk Level
          </span>
          <p className="text-lg font-medium capitalize">
            {publicReport.riskLevel}
          </p>
        </div>

        {publicReport.summary && (
          <div>
            <span className="text-xs uppercase text-muted-foreground">
              Summary
            </span>
            <p className="text-sm leading-relaxed">
              {publicReport.summary}
            </p>
          </div>
        )}
      </section>

      <footer className="text-xs text-muted-foreground">
        This report is provided for informational purposes only and reflects
        data available at the time of publication.
      </footer>
    </main>
  );
}
