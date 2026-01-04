import { adminDb } from "@/firebase/server";
import { notFound } from "next/navigation";
import { ReportLedgerPanel } from "@/components/reports/ReportLedgerPanel";

// Define a type for Ledger Entries for type safety
type LedgerEntry = {
  id: string;
  action: string;
  createdAt: string;
};

async function getReportData(reportNameId: string) {
  const reportRef = adminDb.collection("reports").doc(reportNameId);
  const reportSnap = await reportRef.get();
  if (!reportSnap.exists) {
    notFound();
  }
  return reportSnap.data();
}

async function getLedgerEntries(reportNameId: string) {
  const ledgerSnap = await adminDb
    .collection("reportLedger")
    .where("reportNameId", "==", reportNameId)
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  return ledgerSnap.docs.map((d) => ({
    id: d.id,
    action: d.data().action,
    createdAt: d.data().createdAt.toDate().toISOString(),
  })) as LedgerEntry[];
}

export default async function ReportDetailPage({
  params,
}: {
  params: { reportNameId: string };
}) {
  const { reportNameId } = params;
  const reportData = await getReportData(reportNameId);
  const ledgerEntries = await getLedgerEntries(reportNameId);

  return (
    <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-4">Report Details</h1>
        {/* Placeholder for the main report content component */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <pre className="text-sm">{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      </div>
      <div className="md:col-span-1">
        <ReportLedgerPanel entries={ledgerEntries} />
      </div>
    </div>
  );
}
