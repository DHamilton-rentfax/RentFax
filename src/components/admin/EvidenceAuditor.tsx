'use client';

import { useEffect, useState } from 'react';
import { FileText, Eye, Download, ShieldCheck, User, Clock } from 'lucide-react';

function formatTimestamp(ts: any) {
    if (!ts) return "N/A";
    // Handle both Firestore Timestamp objects and ISO strings
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString();
}

// Component to display the chain of custody for a piece of evidence
export function EvidenceChainOfCustody({ evidenceId }) {
    const [timeline, setTimeline] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!evidenceId) return;
        
        async function fetchChainOfCustody() {
            try {
                // In a real app, this would be a dedicated, secure API endpoint
                const res = await fetch(`/api/evidence/${evidenceId}/access`);
                const evidenceData = await res.json();

                const resLogs = await fetch(`/api/evidence/${evidenceId}/logs`); // You'd need to create this API
                const logsData = await resLogs.json();

                let events = [];

                // 1. Upload Event
                events.push({
                    icon: FileText,
                    title: `Evidence Uploaded by ${evidenceData.uploaderRole}`,
                    timestamp: evidenceData.createdAt,
                    description: `File: ${evidenceData.fileName} (${(evidenceData.fileSize / 1024).toFixed(2)} KB)`,
                });

                // 2. Access Events
                logsData.logs.forEach((log: any) => {
                    events.push({
                        icon: log.action === 'DOWNLOAD' ? Download : Eye,
                        title: `${log.action === 'DOWNLOAD' ? 'Downloaded' : 'Viewed'} by ${log.role}`,
                        timestamp: log.createdAt,
                        description: `User ID: ${log.accessedBy}`,
                    });
                });
                
                // 3. Redaction Events
                evidenceData.redactions?.forEach((redaction: any) => {
                    events.push({
                        icon: ShieldCheck,
                        title: `Redacted by Support Admin`,
                        timestamp: redaction.createdAt,
                        description: `Redaction Type: ${redaction.type}`,
                    });
                });

                // Sort events chronologically
                events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                setTimeline(events);
            } catch (error) {
                console.error("Failed to fetch chain of custody", error);
            } finally {
                setLoading(false);
            }
        }

        fetchChainOfCustody();
    }, [evidenceId]);

    if (loading) return <div>Loading timeline...</div>;
    if (timeline.length === 0) return <p>No events found for this evidence.</p>;

    return (
        <div className="space-y-4">
            <h3 className="font-semibold">Chain of Custody</h3>
            <ul className="space-y-3">
                {timeline.map((event, index) => (
                    <li key={index} className="flex gap-3">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200">
                            <event.icon size={16} className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.description}</p>
                            <time className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                <Clock size={12} /> {formatTimestamp(event.timestamp)}
                           </time>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// A full audit viewer for admins
export function AdminEvidenceAuditViewer({ evidenceId }) {
     const [evidence, setEvidence] = useState<any>(null);

    useEffect(() => {
        async function fetchEvidence() {
            const res = await fetch(`/api/evidence/${evidenceId}/access`);
            const data = await res.json();
            setEvidence(data);
        }
        fetchEvidence();
    }, [evidenceId]);

    if (!evidence) return <p>Loading evidence details...</p>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div className="border-b pb-4">
                <h2 className="text-2xl font-bold">Evidence Audit: {evidence.fileName}</h2>
                <p className="text-sm text-gray-600">ID: {evidenceId}</p>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Integrity Check</h3>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                    <ShieldCheck className="text-green-600" />
                    <p className="text-sm font-mono break-all">{evidence.sha256}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">SHA-256 hash calculated at time of upload.</p>
            </div>

            <EvidenceChainOfCustody evidenceId={evidenceId} />

            {/* Redaction and Visibility display would go here */}
        </div>
    );
}
