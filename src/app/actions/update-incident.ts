'use server';

import { adminDb } from '@/firebase/server';
import { logAuditEvent } from './log-audit';

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

export async function updateIncident(
  incidentId: string,
  data: any,
  updatedBy: string,
) {
  try {
    const incidentRef = adminDb.collection('incidents').doc(incidentId);
    const incidentDoc = await incidentRef.get();

    if (!incidentDoc.exists) {
      return { success: false, error: 'Incident not found' };
    }

    const incidentData = incidentDoc.data() || {};
    const updates: any = { ...data, updatedAt: new Date().toISOString() };

    // Smart Amount Tracking Logic
    const amountPaidUpdate = parseFloat(data.amount_paid);
    if (!isNaN(amountPaidUpdate) && amountPaidUpdate !== incidentData.amount_paid) {
      const amountClaimed = incidentData.amount_claimed || 0;
      const newAmountPaid = amountPaidUpdate;
      const amountRemaining = amountClaimed - newAmountPaid;

      updates.amount_paid = newAmountPaid;
      updates.amount_remaining = amountRemaining;
      updates.payment_status = amountRemaining <= 0 ? 'paid' : 'open';

      await logTimelineEvent({
        incidentId: incidentId,
        renterId: incidentData.renterId,
        actorId: updatedBy,
        action: 'PAYMENT_RECORDED',
        message: `Payment of $${newAmountPaid} recorded. New balance: $${amountRemaining}`,
      });
    }

    await incidentRef.update(updates);

    await logAuditEvent({
      action: 'INCIDENT_UPDATED',
      targetIncident: incidentId,
      targetCompany: incidentData.companyId,
      changedBy: updatedBy,
      metadata: { updatedFields: Object.keys(data) },
    });

    await logTimelineEvent({
        incidentId: incidentId,
        renterId: incidentData.renterId,
        actorId: updatedBy,
        action: 'INCIDENT_UPDATED',
        message: `Incident details were updated.`,
      });


    return { success: true };
  } catch (err) {
    console.error('Error updating incident:', err);
    return { success: false, error: (err as Error).message };
  }
}
