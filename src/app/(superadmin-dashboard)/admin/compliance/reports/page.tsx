'use client';

import { useState, useEffect } from 'react';
import { Download, FileText } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data simulating historical weekly reports
const mockReportData = [
  {
    id: "report_week_42_2023",
    week: "October 16-22, 2023",
    totalFlags: 5,
    resolved: 4,
    pending: 1,
  },
  {
    id: "report_week_41_2023",
    week: "October 9-15, 2023",
    totalFlags: 2,
    resolved: 2,
    pending: 0,
  },
  {
    id: "report_week_40_2023",
    week: "October 2-8, 2023",
    totalFlags: 8,
    resolved: 8,
    pending: 0,
  },
];

export default function ComplianceReportsPage() {
  const [reports, setReports] = useState(mockReportData);

  // In a real application, you'd fetch this from a 'complianceReports' collection in Firestore
  useEffect(() => {
    // fetch('/api/admin/compliance-reports').then(res => res.json()).then(data => setReports(data));
  }, []);

  const exportReport = (report: any) => {
    // This function would generate a CSV or PDF of the detailed flags for that week
    console.log(`Exporting report ${report.id}...`);
    const csvContent = `"User ID","Reason","Confidence","Status"\n` + `"user_abc","Contained diagnosis terms",0.95,"resolved"\n`; // Dummy data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `compliance_report_${report.week}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <FileText className="text-gray-700" />
        Compliance Reports
      </h1>
      <p className="text-gray-600 mb-6">
        Review historical weekly compliance summaries and export detailed logs for auditing.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Report History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Total Flags</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.week}</TableCell>
                  <TableCell>{report.totalFlags}</TableCell>
                  <TableCell className="text-green-600">{report.resolved}</TableCell>
                  <TableCell className="text-red-600">{report.pending}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => exportReport(report)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
