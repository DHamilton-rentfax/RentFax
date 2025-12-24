"use client";

import Link from "next/link";

export default function ReportTable({ data }) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left font-semibold">Date</th>
            <th className="p-3 text-left font-semibold">Type</th>
            <th className="p-3 text-left font-semibold">Risk</th>
            <th className="p-3 text-left font-semibold">Fraud</th>
            <th className="p-3 text-left font-semibold">Unpaid</th>
            <th className="p-3 text-left font-semibold">View</th>
          </tr>
        </thead>

        <tbody>
          {data.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
              <td className="p-3">{r.type === "full" ? "Full Report" : "Identity Check"}</td>
              <td className="p-3">{r.riskScore != null ? `${r.riskScore}` : "-"}</td>
              <td className="p-3">{r.fraudCount > 0 ? "Yes" : "No"}</td>
              <td className="p-3">{r.unpaidBalanceCount > 0 ? "Yes" : "No"}</td>
              <td className="p-3">
                <Link
                  className="text-blue-600 underline"
                  href={`/dashboard/reports/${r.reportId}`}
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
