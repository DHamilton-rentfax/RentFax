'use server';

import { adminDB } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { sendIncidentCreatedEmail } from './send-incident-email';

export async function createIncident(data: {
  renterId: string;
  type: string;
  description: string;
  amount?: number;
  evidence?: { url: string; fileName: string; fileType: string }[];
}) {
  try {
    const { renterId, type, description, amount, evidence } = data;

    const newIncidentRef = adminDB.collection('incidents').doc();
    await newIncidentRef.set({
      renterId,
      type,
      description,
      amount: amount || null,
      evidence: evidence || [],
      createdAt: FieldValue.serverTimestamp(),
      status: 'OPEN',
    });

    await adminDB.collection('audit-logs').add({
      action: 'CREATE_INCIDENT',
      incidentId: newIncidentRef.id,
      timestamp: FieldValue.serverTimestamp(),
    });

    await sendIncidentCreatedEmail({
      renterId,
      incidentId: newIncidentRef.id,
    });

    return { incidentId: newIncidentRef.id };
  } catch (error: any) {
    console.error(error);
    return { error: 'Failed to create incident.' };
  }
}
