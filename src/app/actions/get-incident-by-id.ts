
'use server';

import { adminDB } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';

export interface Incident {
    id: string;
    renterId: string;
    type: string;
    status: string;
    description: string;
    createdAt: string;
    evidence?: string[];
}

export const getIncidentById = async (id: string): Promise<Incident | null> => {
    try {
        const incidentDoc = await adminDB.collectionGroup('incidents').where('id', '==', id).get();

        if (incidentDoc.empty) {
            return null;
        }

        const incidentSnapshot = incidentDoc.docs[0];
        const incidentData = incidentSnapshot.data();

        return {
            id: incidentSnapshot.id,
            renterId: incidentSnapshot.ref.parent.parent!.id,
            type: incidentData.type,
            status: incidentData.status,
            description: incidentData.description,
            createdAt: incidentData.createdAt.toDate().toISOString(),
            evidence: incidentData.evidence || [],
        };
    } catch (error) {
        console.error('Error fetching incident by ID:', error);
        return null;
    }
};
