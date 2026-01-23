'use server';

import { adminDb } from '@/firebase/server';
import { logAuditEvent } from './log-audit';
import { assessIncidentRisk } from './assess-risk'; // Import the risk assessment function

// Assuming you have a function to log timeline events
async function logTimelineEvent(event: any) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/incidents/logTimeline`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to log timeline event');
        }

    } catch (error) {
        console.error('Error logging timeline event:', error);
    }
}

export async function createIncident(
  data: any,
  companyId: string,
  createdBy: string,
) {
  try {
    const amountClaimed = parseFloat(data.amount) || 0;
    const initialIncidentData = {
      ...data,
      companyId,
      createdBy,
      createdAt: new Date().toISOString(),
      amount_claimed: amountClaimed,
      amount_paid: 0,
      amount_remaining: amountClaimed,
      payment_status: amountClaimed > 0 ? 'open' : 'paid',
      highRisk: false,
      riskReasons: [],
    };

    const ref = await adminDb.collection('incidents').add(initialIncidentData);

    await logAuditEvent({
      action: 'INCIDENT_CREATED',
      targetIncident: ref.id,
      targetCompany: companyId,
      changedBy: createdBy,
      metadata: { amount: data.amount, renter: data.renter },
    });

    await logTimelineEvent({
      incidentId: ref.id,
      renterId: data.renterId,
      actorId: createdBy,
      action: 'INCIDENT_CREATED',
      message: `Incident created for $${amountClaimed}.`,
    });

    // Asynchronously assess risk without blocking the response
    assessIncidentRisk(ref.id).catch(console.error);

    return { success: true, id: ref.id };
  } catch (err) {
    console.error('Error creating incident:', err);
    return { success: false, error: (err as Error).message };
  }
}
