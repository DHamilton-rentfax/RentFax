"use client";

import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { useRouter } from "next/navigation";

export default function ReportCard({ report }: { report: any }) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`/reports/${report.id}`)}
      className="cursor-pointer hover:shadow-md transition"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">{report.renterName}</h3>
        <Badge type={report.status === "verified" ? "success" : "warning"}>
          {report.status}
        </Badge>
      </div>
      <p className="text-xs text-gray-500">
        Created: {new Date(report.createdAt).toLocaleDateString()}
      </p>
      <p className="text-xs text-gray-500">Type: {report.type}</p>
    </Card>
  );
}
