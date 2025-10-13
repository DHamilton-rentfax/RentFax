"use server";
/**
 * @fileOverview Genkit flows for managing disputes.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { logAudit } from "./audit";
import { sendNotification } from "@/lib/notifications";
// import {FlowAuth} from 'genkit/flow';
import { admin, adminDB as db, adminAuth } from "@/lib/firebase-admin";

const PROJECT_ID = process.env.GCLOUD_PROJECT!;
const LOCATION = process.env.TASKS_LOCATION || "us-central1";
const QUEUE_ID = process.env.TASKS_QUEUE_ID || "rentfax-disputes";
const REMINDER_URL = process.env.DISPUTE_REMINDER_URL || ""; // Should be a secure webhook/function URL

let tasksClient: any;

async function getTasksClient() {
  if (tasksClient) return tasksClient;
  const { CloudTasksClient } = await import("@google-cloud/tasks");
  tasksClient = new CloudTasksClient();
  return tasksClient;
}

async function scheduleReminder(id: string, hoursFromNow: number) {
  if (!REMINDER_URL) {
    console.warn("DISPUTE_REMINDER_URL not set, skipping task scheduling.");
    return;
  }
  const client = await getTasksClient();
  const parent = client.queuePath(PROJECT_ID, LOCATION, QUEUE_ID);
  const body = Buffer.from(JSON.stringify({ id })).toString("base64");
  const scheduleTime = {
    seconds: Math.floor(Date.now() / 1000) + hoursFromNow * 3600,
  };

  await client.createTask({
    parent,
    task: {
      httpRequest: {
        httpMethod: "POST",
        url: REMINDER_URL,
        headers: { "Content-Type": "application/json" },
        body,
      },
      scheduleTime,
    },
  });
}

const StartDisputeSchema = z.object({
  renterId: z.string(),
  incidentId: z.string(),
  reason: z.string(),
  message: z.string().optional(),
  attachments: z
    .array(z.object({ name: z.string(), path: z.string() }))
    .optional(),
});
export type StartDisputeInput = z.infer<typeof StartDisputeSchema>;

const StartDisputeOutputSchema = z.object({
  id: z.string(),
  created: z.boolean(),
});
export type StartDisputeOutput = z.infer<typeof StartDisputeOutputSchema>;

export async function startDispute(
  input: StartDisputeInput,
  auth?: any,
): Promise<StartDisputeOutput> {
  return await startDisputeFlow(input, auth);
}

const startDisputeFlow = ai.defineFlow(
  {
    name: "startDisputeFlow",
    inputSchema: StartDisputeSchema,
    outputSchema: StartDisputeOutputSchema,
    // authPolicy: async (auth, input) => {
    //   if (!auth) throw new Error('Authentication is required.');
    // },
  },
  async (payload, { auth }) => {
    if (!auth) throw new Error("Auth context missing");
    const { uid } = auth;
    const { companyId, role } =
      ((await adminAuth.getUser(uid)).customClaims as any) || {};

    if (!payload.renterId || !payload.incidentId || !payload.reason) {
      throw new Error("renterId, incidentId, reason required");
    }
    const renter = await db.doc(`renters/${payload.renterId}`).get();
    if (!renter.exists || renter.data()?.companyId !== companyId) {
      throw new Error("Renter not in your company");
    }
    if (role === "renter") {
      const renterUid = renter.data()?.renterUid;
      if (renterUid && renterUid !== uid) throw new Error("Not your dispute");
    }

    const now = admin.firestore.FieldValue.serverTimestamp();
    const slaDueAt = admin.firestore.Timestamp.fromMillis(
      Date.now() + 7 * 24 * 3600 * 1000,
    );

    const disputePayload = {
      companyId,
      ...payload,
      renterUid: role === "renter" ? uid : renter.data()?.renterUid || null,
      status: "open",
      messages: payload.message
        ? [
            {
              by: role === "renter" ? "renter" : "company",
              uid,
              text: payload.message,
              at: new Date().toISOString(),
            },
          ]
        : [],
      slaDueAt,
      createdAt: now,
      updatedAt: now,
    };
    const ref = await db.collection("disputes").add(disputePayload);
    await logAudit({
      actorUid: uid,
      actorRole: role,
      companyId: companyId,
      targetPath: `disputes/${ref.id}`,
      action: "startDispute",
      after: disputePayload,
    });

    try {
      await scheduleReminder(ref.id, 48);
    } catch (e) {
      console.warn("scheduleReminder failed in dev", e);
    }

    await sendNotification({
      templateId: "dispute.opened",
      recipientId: payload.renterId, // Assuming the handler will also notify the company
      data: {
        companyId: companyId,
        id: ref.id,
        renterId: payload.renterId,
        incidentId: payload.incidentId,
      },
    });

    return { id: ref.id, created: true };
  },
);

const PostDisputeMessageSchema = z.object({
  id: z.string(),
  text: z.string(),
});
export type PostDisputeMessageInput = z.infer<typeof PostDisputeMessageSchema>;

const PostDisputeMessageOutputSchema = z.object({ ok: z.boolean() });
export type PostDisputeMessageOutput = z.infer<
  typeof PostDisputeMessageOutputSchema
>;

export async function postDisputeMessage(
  input: PostDisputeMessageInput,
  auth?: any,
): Promise<PostDisputeMessageOutput> {
  return await postDisputeMessageFlow(input, auth);
}

const postDisputeMessageFlow = ai.defineFlow(
  {
    name: "postDisputeMessageFlow",
    inputSchema: PostDisputeMessageSchema,
    outputSchema: PostDisputeMessageOutputSchema,
    // authPolicy: async (auth, input) => {
    //   if (!auth) throw new Error('Authentication is required.');
    // },
  },
  async (payload, { auth }) => {
    if (!auth) throw new Error("Auth context missing");
    const { uid } = auth;
    const { companyId, role } =
      ((await adminAuth.getUser(uid)).customClaims as any) || {};

    const ref = db.doc(`disputes/${payload.id}`);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("Dispute not found");

    const d = snap.data()!;
    if (d.companyId !== companyId) throw new Error("Cross-company blocked");
    if (role === "renter" && d.renterUid && d.renterUid !== uid)
      throw new Error("Not your dispute");

    const msg = {
      by: role === "renter" ? "renter" : "company",
      uid,
      text: payload.text,
      at: new Date().toISOString(),
    };
    await ref.update({
      messages: admin.firestore.FieldValue.arrayUnion(msg),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await logAudit({
      actorUid: uid,
      actorRole: role,
      companyId: companyId,
      targetPath: `disputes/${payload.id}`,
      action: "postDisputeMessage",
      after: { text: payload.text },
    });

    return { ok: true };
  },
);

const UpdateDisputeStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["open", "needs_info", "resolved", "rejected"]),
});
export type UpdateDisputeStatusInput = z.infer<
  typeof UpdateDisputeStatusSchema
>;

const UpdateDisputeStatusOutputSchema = z.object({ ok: z.boolean() });
export type UpdateDisputeStatusOutput = z.infer<
  typeof UpdateDisputeStatusOutputSchema
>;

export async function updateDisputeStatus(
  input: UpdateDisputeStatusInput,
  auth?: any,
): Promise<UpdateDisputeStatusOutput> {
  return await updateDisputeStatusFlow(input, auth);
}

const updateDisputeStatusFlow = ai.defineFlow(
  {
    name: "updateDisputeStatusFlow",
    inputSchema: UpdateDisputeStatusSchema,
    outputSchema: z.object({ ok: z.boolean() }),
    // authPolicy: async (auth, input) => {
    //   if (!auth) throw new Error('Authentication is required.');
    //   const {role} = ((await authAdmin.getUser(auth.uid)).customClaims as any) || {};
    //   if (!['owner', 'manager', 'agent', 'collections'].includes(role)) {
    //     throw new Error('Only company roles may update status');
    //   }
    // },
  },
  async (payload, { auth }) => {
    if (!auth) throw new Error("Auth context missing");
    const { uid } = auth;
    const { companyId, role } =
      ((await adminAuth.getUser(uid)).customClaims as any) || {};

    const ref = db.doc(`disputes/${payload.id}`);
    const snap = await ref.get();
    if (!snap.exists) throw new Error("Dispute not found");

    const d = snap.data()!;
    if (d.companyId !== companyId) throw new Error("Cross-company blocked");

    await ref.update({
      status: payload.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    await logAudit({
      actorUid: uid,
      actorRole: role,
      companyId: companyId,
      targetPath: `disputes/${payload.id}`,
      action: "updateDisputeStatus",
      after: { status: payload.status },
    });

    await sendNotification({
      templateId: "dispute.statusChanged",
      recipientId: d.renterId,
      data: {
        renterId: d.renterId,
        id: payload.id,
        status: payload.status,
      },
    });

    return { ok: true };
  },
);
