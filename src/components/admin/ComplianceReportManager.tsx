'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  FileJson,
  FileText,
} from 'lucide-react';

const STATUS_ICONS = {
  QUEUED: <Loader2 className="animate-spin text-gray-500 h-5 w-5" />,
  GENERATING: <Loader2 className="animate-spin text-blue-500 h-5 w-5" />,
  READY: <CheckCircle className="text-green-500 h-5 w-5" />,
  FAILED: <AlertCircle className="text-red-500 h-5 w-5" />,
};

const MOCK_REPORT_TYPES = [
  { key: 'DISPUTE_FULL', title: 'Full Dispute Report' },
  { key: 'INCIDENT_SUMMARY', title: 'Incident Summary' },
  { key: 'AUDIT_ACTIVITY', title: 'Full System Audit Log' },
];

type ReportItem = {
  id: string;
  status: keyof typeof STATUS_ICONS;
  reportTypeKey: string;
  relatedId?: string;
};

export function ComplianceReportManager() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportType, setSelectedReportType] =
    useState('DISPUTE_FULL');
  const [relatedId, setRelatedId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const res = await fetch(
        '/api/admin/compliance/reports/generate',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reportTypeKey: selectedReportType,
            relatedId,
            relatedType: 'DISPUTE',
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to generate report');
      }

      setReports((prev) => [
        {
          id: data.reportId,
          status: 'QUEUED',
          reportTypeKey: selectedReportType,
          relatedId,
        },
        ...prev,
      ]);

      setRelatedId('');
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown error';
      console.error('Failed to generate report:', err);
      alert(`Error: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) return <div>Loading reports...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">
        Compliance Report Center
      </h1>

      <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
        <h2 className="font-semibold">Generate New Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            value={selectedReportType}
            onValueChange={setSelectedReportType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Report Type" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_REPORT_TYPES.map((rt) => (
                <SelectItem key={rt.key} value={rt.key}>
                  {rt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Enter Related ID (e.g., Dispute ID)"
            value={relatedId}
            onChange={(e) => setRelatedId(e.target.value)}
            disabled={selectedReportType === 'AUDIT_ACTIVITY'}
          />

          <Button
            onClick={handleGenerate}
            disabled={
              isGenerating ||
              (selectedReportType !== 'AUDIT_ACTIVITY' &&
                !relatedId)
            }
            className="flex items-center gap-2"
          >
            {isGenerating && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Generate Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold">Generated Reports</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500">
            No reports generated yet.
          </p>
        ) : (
          <ul className="border rounded-md divide-y">
            {reports.map((report) => (
              <li
                key={report.id}
                className="p-3 flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 text-center">
                    {STATUS_ICONS[report.status]}
                  </div>
                  <div>
                    <p className="font-medium">
                      {report.reportTypeKey}
                    </p>
                    <p className="text-xs text-gray-500">
                      ID: {report.id}{' '}
                      {report.relatedId &&
                        `(Case: ${report.relatedId})`}
                    </p>
                  </div>
                </div>

                {report.status === 'READY' && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <FileText className="h-4 w-4" />
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="px-3 py-1 text-sm flex items-center gap-1"
                    >
                      <FileJson className="h-4 w-4" />
                      JSON
                    </Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
