import { adminDb } from "@/firebase/server";
import { redirect, notFound } from "next/navigation";
import { Timestamp } from "firebase-admin/firestore";

type PublicReport = {
  paid: boolean;
  status: string;
  incidentCount: number;
  riskLevel: string;
  expiresAt?: Timestamp;
  createdAt: Timestamp;
};

export default async function PublicReportPage({
  params,
}: {
  params: { token: string };
}) {
  if (!params.token) notFound();

  const ref = adminDb.collection("public_reports").doc(params.token);
  const snap = await ref.get();

  if (!snap.exists) notFound();

  const report = snap.data() as PublicReport;

  // 🔒 Payment enforcement
  if (!report.paid) {
    redirect(`/checkout/report?token=${params.token}`);
  }

  // ⏳ Optional expiration (future-proofing)
  if (
    report.expiresAt &&
    report.expiresAt.toMillis() < Date.now()
  ) {
    redirect("/report-expired");
  }

  // 🧾 Audit: report viewed
  await adminDb.collection("audit_logs").add({
    action: "PUBLIC_REPORT_VIEWED",
    targetType: "REPORT",
    targetId: params.token,
    createdAt: Timestamp.now(),
    metadata: {
      riskLevel: report.riskLevel,
    },
  });

  return (
    <main className="relative max-w-3xl mx-auto py-10 px-6">
      {/* Watermark layer */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-5 text-4xl font-bold rotate-[-30deg]">
        RentFAX • Confidential
      </div>

      <h1 className="text-2xl font-semibold mb-6">
        RentFAX Verification Report
      </h1>

      <div
        className="space-y-4"
        onCopy={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div>
          <strong>Status:</strong> {report.status}
        </div>
        <div>
          <strong>Incidents:</strong> {report.incidentCount}
        </div>
        <div>
          <strong>Risk Level:</strong> {report.riskLevel}
        </div>
      </div>
    </main>
  );
}
