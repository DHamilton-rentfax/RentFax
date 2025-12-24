'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Shield, Clock, FileText } from 'lucide-react';

const ICONS: any = {
    APPROVED: <CheckCircle className="text-green-500" />,
    PARTIALLY_APPROVED: <CheckCircle className="text-yellow-500" />,
    DENIED: <XCircle className="text-red-500" />,
    DISMISSED: <XCircle className="text-gray-500" />,
    NEEDS_MORE_INFO: <AlertTriangle className="text-blue-500" />,
    APPEAL_SUBMITTED: <Shield className="text-purple-500" />
};

function formatTimestamp(ts: any) {
    if (!ts) return "N/A";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
}

// Shows the linear history of decisions and appeals for a single dispute/incident
export function DecisionTimeline({ relatedId, relatedType }) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!relatedId) return;

        async function fetchHistory() {
            // In a real app, this should be a single, optimized API call
            const decisionsRes = await fetch(`/api/decisions/history/${relatedId}`);
            const appealsRes = await fetch(`/api/appeals/history/${relatedId}`);
            
            const decisions = await decisionsRes.json();
            const appeals = await appealsRes.json();

            let combined = [
                ...decisions.map((d:any) => ({ ...d, type: 'DECISION' })),
                ...appeals.map((a:any) => ({ ...a, type: 'APPEAL' }))
            ];

            combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setHistory(combined);
            setLoading(false);
        }

        fetchHistory();
    }, [relatedId]);

    if (loading) return <div>Loading decision history...</div>;

    return (
        <div className="space-y-6">
            <h3 className="font-bold text-lg">Decision & Appeal History</h3>
            {history.map((item, index) => (
                <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100">
                           {ICONS[item.type === 'DECISION' ? item.outcome : 'APPEAL_SUBMITTED'] || <FileText />}
                        </div>
                        {index < history.length - 1 && <div className="w-px h-full bg-gray-200" />}                    </div>
                    <div className="pb-6">
                        <p className="font-semibold">
                            {item.type === 'DECISION' ? `Decision v${item.decisionVersion}: ${item.outcome}` : 'Appeal Submitted'}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{item.type === 'DECISION' ? item.explanation : item.justification}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                            <Clock size={14} />
                            <span>{formatTimestamp(item.createdAt)} by {item.decidedByRole || item.submitterRole}</span>
                        </div>
                        {item.reasonCodes && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {item.reasonCodes.map((code:string) => (
                                    <Badge key={code} variant="secondary">{code}</Badge>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// Wrapper for the Admin view
export function AdminDecisionViewer({ relatedId, relatedType }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <DecisionTimeline relatedId={relatedId} relatedType={relatedType} />
            {/* Admin-specific details could be added here, like links to user profiles, etc. */}
        </div>
    );
}

