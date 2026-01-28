'use server';

import { adminDb } from '@/firebase/server';
import { FieldValue } from 'firebase-admin/firestore';
import { sendIncidentCreatedEmail } from './send-incident-email';

export async function createIncident(data: {
  renterId: string;
  type: string;
  description: string;
  amount?: number;
  evidence?: { url: string; fileName: string; fileType: string }[];
}) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { renterId, type, description, amount, evidence } = data;

    const newIncidentRef = adminDb.collection('incidents').doc();
    await newIncidentRef.set({
      renterId,
      type,
      description,
      amount: amount || null,
      evidence: evidence || [],
      createdAt: FieldValue.serverTimestamp(),
      status: 'OPEN',
    });

    await adminDb.collection('audit-logs').add({
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
