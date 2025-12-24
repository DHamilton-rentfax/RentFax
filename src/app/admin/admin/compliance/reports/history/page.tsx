import { adminDb } from "@/firebase/server";
import { ComplianceReport } from "@/types/compliance";

async function getReportHistory(): Promise<ComplianceReport[]> {
  const snap = await db.collection("complianceReports").orderBy("createdAt", "desc").get();
  return snap.docs.map((d) => d.data() as ComplianceReport);
}

export default async function ComplianceReportHistory() {
  const reports = await getReportHistory();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-2">Compliance Report History</h1>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.filePath} className="p-4 border rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">{new Date(report.createdAt.seconds * 1000).toLocaleDateString()}</p>
              <p className="text-sm text-gray-500">{report.compliant}/{report.totalUsers} users compliant ({report.complianceRate}%)</p>
            </div>
            <a href={report.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Download</a>
          </div>
        ))}
      </div>
    </div>
  );
}
