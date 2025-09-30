'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Button } from '@/components/ui/button';

interface Incident {
    id: string;
    type: string;
    description: string;
    status: string;
    evidence?: string[];
    tags?: string[];
    createdAt: any;
}

interface Dispute {
    id: string;
    message: string;
    evidence?: string[];
    submittedBy: string;
    createdAt: any;
}

export default function AdminIncidentDetailPage({ params }: { params: { id: string } }) {
    const searchParams = useSearchParams();
    const renterId = searchParams.get('renterId');
    const [incident, setIncident] = useState<Incident | null>(null);
    const [dispute, setDispute] = useState<Dispute | null>(null);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState<string>('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!renterId || !params.id) return;

        const fetchIncidentAndDispute = async () => {
            // Fetch the incident
            const incidentRef = doc(db, `renters/${renterId}/incidents`, params.id);
            const incidentSnap = await getDoc(incidentRef);
            if (incidentSnap.exists()) {
                const incidentData = { id: incidentSnap.id, ...incidentSnap.data() } as Incident;
                setIncident(incidentData);
                setNewStatus(incidentData.status);

                // If incident is disputed, fetch the dispute
                if (incidentData.status === 'under_review' || incidentData.status === 'resolved' || incidentData.status === 'dismissed') {
                    const disputesRef = collection(db, `renters/${renterId}/disputes`);
                    const q = query(disputesRef, where("incidentId", "==", params.id));
                    const disputeSnaps = await getDocs(q);
                    if (!disputeSnaps.empty) {
                        const disputeData = disputeSnaps.docs[0].data() as Omit<Dispute, 'id'>;
                        setDispute({ id: disputeSnaps.docs[0].id, ...disputeData });
                    }
                }
            } else {
                console.error("Incident not found!");
            }
            setLoading(false);
        };

        fetchIncidentAndDispute();
    }, [renterId, params.id]);

    const handleStatusUpdate = async () => {
        if (!renterId || !incident || !newStatus) return;
        setIsUpdating(true);
        try {
            const incidentRef = doc(db, `renters/${renterId}/incidents`, incident.id);
            await updateDoc(incidentRef, { status: newStatus });
            setIncident(prev => prev ? { ...prev, status: newStatus } : null);
            alert('Status updated successfully!');
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="max-w-4xl mx-auto py-8 px-4">Loading incident details...</div>;
    if (!incident) return <div className="max-w-4xl mx-auto py-8 px-4">Incident not found.</div>;

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
            {/* Incident Details Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Incident Details</h1>
                <p><strong>Renter ID:</strong> {renterId}</p>
                <p><strong>Type:</strong> {incident.type}</p>
                <p><strong>Date Reported:</strong> {new Date(incident.createdAt?.toDate()).toLocaleString()}</p>
                <p><strong>Description:</strong> {incident.description}</p>
                {/* ... other details like tags, evidence */}
            </div>

            {/* Dispute Details Section (if exists) */}
            {dispute && (
                <div className="bg-yellow-50 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Dispute Information</h2>
                    <p><strong>Dispute Submitted On:</strong> {new Date(dispute.createdAt?.toDate()).toLocaleString()}</p>
                    <p><strong>Renter's Message:</strong></p>
                    <blockquote className="border-l-4 pl-4 italic">{dispute.message}</blockquote>
                    {/* ... dispute evidence */}
                </div>
            )}

            {/* Status Management Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Manage Status</h2>
                <div className="flex items-center space-x-4">
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input">
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="resolved">Resolved</option>
                        <option value="dismissed">Dismissed</option>
                    </select>
                    <Button onClick={handleStatusUpdate} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Update Status'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
