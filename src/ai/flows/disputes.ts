'use server';
/**
 * @fileOverview Genkit flows for managing disputes.
 */

import { onFlow } from '@genkit-ai/next/server';
import { z } from 'genkit';
import * as admin from 'firebase-admin';
import { CloudTasksClient } from '@google-cloud/tasks';
import { logAudit } from './audit';
import { sendMail } from '@/lib/email';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

const PROJECT_ID = process.env.GCLOUD_PROJECT!;
const LOCATION = process.env.TASKS_LOCATION || 'us-central1';
const QUEUE_ID = process.env.TASKS_QUEUE_ID || 'rentfax-disputes';
const REMINDER_URL = process.env.DISPUTE_REMINDER_URL || ''; // Should be a secure webhook/function URL

const tasksClient = new CloudTasksClient();

async function scheduleReminder(disputeId: string, hoursFromNow: number) {
  if (!REMINDER_URL) {
    console.warn('DISPUTE_REMINDER_URL not set, skipping task scheduling.');
    return;
  }
  const parent = tasksClient.queuePath(PROJECT_ID, LOCATION, QUEUE_ID);
  const body = Buffer.from(JSON.stringify({ disputeId })).toString('base64');
  const scheduleTime = { seconds: Math.floor(Date.now() / 1000) + hoursFromNow * 3600 };

  await tasksClient.createTask({
    parent,
    task: {
      httpRequest: {
        httpMethod: 'POST',
        url: REMINDER_URL,
        headers: { 'Content-Type': 'application/json' },
        body
      },
      scheduleTime
    }
  });
}


const StartDisputeSchema = z.object({
    renterId: z.string(),
    incidentId: z.string(),
    reason: z.string(),
    message: z.string().optional(),
    attachments: z.array(z.object({ name: z.string(), path: z.string() })).optional(),
});
export const startDispute = onFlow(
  {
    name: 'startDispute',
    inputSchema: StartDisputeSchema,
    outputSchema: z.object({ id: z.string(), created: z.boolean() }),
    authPolicy: async (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
    }
  },
  async (payload, {auth}) => {
    if(!auth) throw new Error("Auth context missing");
    const { uid, claims } = auth;
    const { companyId, role } = claims as any;

    if (!payload.renterId || !payload.incidentId || !payload.reason) {
        throw new Error('renterId, incidentId, reason required');
    }
    const renter = await db.doc(`renters/${payload.renterId}`).get();
    if (!renter.exists || renter.data()?.companyId !== companyId) {
        throw new Error('Renter not in your company');
    }
    if (role === 'renter') {
        const renterUid = renter.data()?.renterUid;
        if (renterUid && renterUid !== uid) throw new Error('Not your dispute');
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const slaDueAt = admin.firestore.Timestamp.fromMillis(Date.now() + 7 * 24 * 3600 * 1000);

    const disputePayload = {
        companyId,
        ...payload,
        renterUid: role === 'renter' ? uid : (renter.data()?.renterUid || null),
        status: 'open',
        messages: payload.message ? [{ by: role === 'renter' ? 'renter' : 'company', uid, text: payload.message, at: new Date().toISOString() }] : [],
        slaDueAt,
        createdAt: now,
        updatedAt: now
    };
    const ref = await db.collection('disputes').add(disputePayload);
    await logAudit({
        actorUid: uid, actorRole: role, companyId: companyId,
        targetPath: `disputes/${ref.id}`, action: 'startDispute', after: disputePayload
    });

    try { await scheduleReminder(ref.id, 48); } catch (e) { console.warn('scheduleReminder failed in dev', e); }
    
    await sendMail({
        to: process.env.COMPANY_NOTIF_EMAIL || 'team@example.com',
        subject: `New dispute opened (${ref.id})`,
        text: `A new dispute has been opened for renter ${payload.renterId} and incident ${payload.incidentId}.`
    });

    return { id: ref.id, created: true };
  }
);


const PostDisputeMessageSchema = z.object({
    disputeId: z.string(),
    text: z.string(),
});
export const postDisputeMessage = onFlow({
    name: 'postDisputeMessage',
    inputSchema: PostDisputeMessageSchema,
    outputSchema: z.object({ ok: z.boolean() }),
    authPolicy: async (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
    },
}, async (payload, {auth}) => {
    if(!auth) throw new Error("Auth context missing");
    const { uid, claims } = auth;
    const { companyId, role } = claims as any;
    
    const ref = db.doc(`disputes/${payload.disputeId}`);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('Dispute not found');

    const d = snap.data()!;
    if (d.companyId !== companyId) throw new Error('Cross-company blocked');
    if (role === 'renter' && d.renterUid && d.renterUid !== uid) throw new Error('Not your dispute');

    const msg = { by: role === 'renter' ? 'renter' : 'company', uid, text: payload.text, at: new Date().toISOString() };
    await ref.update({
        messages: admin.firestore.FieldValue.arrayUnion(msg),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    await logAudit({
        actorUid: uid, actorRole: role, companyId: companyId,
        targetPath: `disputes/${payload.disputeId}`, action: 'postDisputeMessage', after: { text: payload.text }
    });

    return { ok: true };
});


const UpdateDisputeStatusSchema = z.object({
    disputeId: z.string(),
    status: z.enum(['open', 'needs_info', 'resolved', 'rejected']),
});
export const updateDisputeStatus = onFlow({
    name: 'updateDisputeStatus',
    inputSchema: UpdateDisputeStatusSchema,
    outputSchema: z.object({ ok: z.boolean() }),
    authPolicy: async (auth, input) => {
        if (!auth) throw new Error('Authentication is required.');
        const { claims } = auth;
        const { role } = claims as any;
        if (!['owner','manager','agent','collections'].includes(role)) {
            throw new Error('Only company roles may update status');
        }
    },
}, async (payload, {auth}) => {
     if(!auth) throw new Error("Auth context missing");
    const { uid, claims } = auth;
    const { companyId, role } = claims as any;
    
    const ref = db.doc(`disputes/${payload.disputeId}`);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('Dispute not found');

    const d = snap.data()!;
    if (d.companyId !== companyId) throw new Error('Cross-company blocked');

    await ref.update({ status: payload.status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    await logAudit({
        actorUid: uid, actorRole: role, companyId: companyId,
        targetPath: `disputes/${payload.disputeId}`, action: 'updateDisputeStatus', after: { status: payload.status }
    });
    
    await sendMail({
        to: process.env.RENTER_NOTIF_FALLBACK || 'noreply@example.com',
        subject: `Your dispute status is now "${payload.status}"`,
        text: `Dispute ${payload.disputeId} status changed to ${payload.status}.`
    });

    return { ok: true };
});
