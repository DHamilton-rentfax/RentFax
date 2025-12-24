'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileDown, Loader2, AlertCircle, CheckCircle, FileJson, FileText } from 'lucide-react';

const STATUS_ICONS = {
    QUEUED: <Loader2 className="animate-spin text-gray-500" />,
    GENERATING: <Loader2 className="animate-spin text-blue-500" />,
    READY: <CheckCircle className="text-green-500" />,
    FAILED: <AlertCircle className="text-red-500" />,
};

// Mock data for report types
const MOCK_REPORT_TYPES = [
    { key: 'DISPUTE_FULL', title: 'Full Dispute Report' },
    { key: 'INCIDENT_SUMMARY', title: 'Incident Summary' },
    { key: 'AUDIT_ACTIVITY', title: 'Full System Audit Log' },
];

export function ComplianceReportManager() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReportType, setSelectedReportType] = useState('DISPUTE_FULL');
    const [relatedId, setRelatedId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Fetch existing reports from a listener in a real app
        // For now, we'll start with an empty list
        setLoading(false);
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await fetch('/api/admin/compliance/reports/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    reportTypeKey: selectedReportType, 
                    relatedId: relatedId, 
                    relatedType: 'DISPUTE' // Hardcoded for this example
                }),
            });
            const newReport = await res.json();
            if (!res.ok) throw new Error(newReport.error);

            // Add a placeholder to the list immediately
            setReports(prev => [{ id: newReport.reportId, status: 'QUEUED', reportTypeKey: selectedReportType, relatedId }, ...prev]);
            setRelatedId('');
        } catch (error) {
            console.error("Failed to generate report:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <h1 className="text-2xl font-bold">Compliance Report Center</h1>
            
            <div className="p-4 border rounded-lg space-y-4 bg-gray-50">
                 <h2 className="font-semibold">Generate New Report</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                        <SelectTrigger><SelectValue placeholder="Select Report Type" /></SelectTrigger>
                        <SelectContent>
                            {MOCK_REPORT_TYPES.map(rt => <SelectItem key={rt.key} value={rt.key}>{rt.title}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input 
                        placeholder="Enter Related ID (e.g., Dispute ID)"
                        value={relatedId}
                        onChange={e => setRelatedId(e.target.value)}
                        disabled={selectedReportType === 'AUDIT_ACTIVITY'}
                    />
                    <Button onClick={handleGenerate} disabled={isGenerating || (selectedReportType !== 'AUDIT_ACTIVITY' && !relatedId)}>
                        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Generate Report
                    </Button>
                 </div>
            </div>

            <div className="space-y-4">
                <h2 className="font-semibold">Generated Reports</h2>
                {reports.length === 0 ? (
                    <p className="text-gray-500">No reports generated yet.</p>
                ) : (
                    <ul className="border rounded-md divide-y">
                        {reports.map(report => (
                            <li key={report.id} className="p-3 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                     <div className="w-6 text-center">{STATUS_ICONS[report.status as keyof typeof STATUS_ICONS]}</div>
                                     <div>
                                        <p className="font-medium">{report.reportTypeKey}</p>
                                        <p className="text-xs text-gray-500">ID: {report.id} {report.relatedId && `(Case: ${report.relatedId})`}</p>
                                     </div>
                                </div>
                                {report.status === 'READY' && (
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm"><FileText size={14} className="mr-1"/> PDF</Button>
                                        <Button variant="outline" size="sm"><FileJson size={14} className="mr-1"/> JSON</Button>
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
