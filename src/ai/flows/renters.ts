"use server";
/**
 * @fileOverview Genkit flows for managing renter records, including bulk import.
 */
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";
import { v4 as uuid } from "uuid";

import { ai } from "@/ai/genkit";
import { admin, adminDB as db, adminAuth } from "@/firebase/server";

import { logAudit } from "./audit";

// --- Upsert Renter ---

const RenterSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  licenseNumber: z.string().min(1),
  licenseState: z.string().length(2),
  dob: z.string(),
  phone: z.string().optional(),
  notes: z.string().optional(),
});
export type Renter = z.infer<typeof RenterSchema>;

const UpsertRenterOutputSchema = z.object({
  id: z.string(),
  created: z.boolean(),
  updated: z.boolean(),
});
export type UpsertRenterOutput = z.infer<typeof UpsertRenterOutputSchema>;

export async function upsertRenter(
  input: Renter,
  auth?: FlowAuth,
): Promise<UpsertRenterOutput> {
  return await upsertRenterFlow(input, auth);
}

const upsertRenterFlow = ai.defineFlow(
  {
    name: "upsertRenterFlow",
    inputSchema: RenterSchema,
    outputSchema: UpsertRenterOutputSchema,
    authPolicy: async (auth) => {
      if (!auth) throw new Error("Authentication required.");
      const { role } = (await adminAuth.getUser(auth.uid)).customClaims || {};
      if (!["owner", "manager", "agent"].includes(role))
        throw new Error("Permission denied.");
    },
  },
  async (payload, { auth }) => {
    const { companyId, uid, role } = auth!.claims as any;
    const { id, ...data } = payload;

    const renterData = {
      ...data,
      companyId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (id) {
      const ref = db.doc(`renters/${id}`);
      await ref.set(renterData, { merge: true });
      await logAudit({
        action: "updateRenter",
        actorUid: uid,
        actorRole: role,
        companyId,
        targetPath: `renters/${id}`,
        before: (await ref.get()).data(),
        after: renterData,
      });
      return { id, created: false, updated: true };
    } else {
      const ref = db.collection("renters").doc();
      await ref.set({
        ...renterData,
        riskScore: 100,
        scoreReasons: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      await logAudit({
        action: "createRenter",
        actorUid: uid,
        actorRole: role,
        companyId,
        targetPath: `renters/${ref.id}`,
        after: renterData,
      });
      return { id: ref.id, created: true, updated: false };
    }
  },
);

// --- Bulk Import Renters ---

const ImportRentersInputSchema = z.object({
  renters: z
    .array(
      z.object({
        name: z.string(),
        email: z.string().optional(),
        licenseNumber: z.string().optional(),
        licenseState: z.string().optional(),
        dob: z.string().optional(),
        phone: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .max(500, "Cannot import more than 500 renters at a time."),
});
export type ImportRentersInput = z.infer<typeof ImportRentersInputSchema>;

const ImportRentersOutputSchema = z.object({
  success: z.boolean(),
  count: z.number(),
  uploadBatchId: z.string(),
});
export type ImportRentersOutput = z.infer<typeof ImportRentersOutputSchema>;

export async function importRenters(
  input: ImportRentersInput,
  auth?: FlowAuth,
): Promise<ImportRentersOutput> {
  return await importRentersFlow(input, auth);
}

const importRentersFlow = ai.defineFlow(
  {
    name: "importRentersFlow",
    inputSchema: ImportRentersInputSchema,
    outputSchema: ImportRentersOutputSchema,
    authPolicy: async (auth) => {
      if (!auth) throw new Error("Authentication required.");
      const { role } = (await adminAuth.getUser(auth.uid)).customClaims || {};
      if (!["owner", "manager"].includes(role))
        throw new Error("Permission denied. Must be an owner or manager.");
    },
  },
  async ({ renters }, { auth }) => {
    const { companyId, uid, role } = auth!.claims as any;
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const uploadBatchId = uuid();
    const addedIds: string[] = [];

    renters.forEach((renter) => {
      const ref = db.collection("renters").doc();
      addedIds.push(ref.id);
      batch.set(ref, {
        ...renter,
        companyId,
        riskScore: 100,
        scoreReasons: [],
        createdAt: now,
        updatedAt: now,
        uploadBatchId,
        uploadedBy: uid,
      });
    });

    // Track the batch for undo
    const batchRef = db.doc(`uploadBatches/${uploadBatchId}`);
    batch.set(batchRef, {
      type: "renter_upload",
      docIds: addedIds,
      companyId,
      uploadedBy: uid,
      createdAt: now,
    });

    await batch.commit();

    await logAudit({
      action: "importRenters",
      actorUid: uid,
      actorRole: role,
      companyId,
      targetPath: `companies/${companyId}`,
      after: { count: renters.length, uploadBatchId },
    });

    return { success: true, count: renters.length, uploadBatchId };
  },
);

// --- Undo Renter Import ---

const UndoRenterImportSchema = z.object({
  uploadBatchId: z.string(),
});
export type UndoRenterImportInput = z.infer<typeof UndoRenterImportSchema>;

const UndoRenterImportOutputSchema = z.object({
  success: z.boolean(),
});
export type UndoRenterImportOutput = z.infer<
  typeof UndoRenterImportOutputSchema
>;

export async function undoRenterImport(
  input: UndoRenterImportInput,
  auth?: FlowAuth,
): Promise<UndoRenterImportOutput> {
  return await undoRenterImportFlow(input, auth);
}

const undoRenterImportFlow = ai.defineFlow(
  {
    name: "undoRenterImportFlow",
    inputSchema: UndoRenterImportSchema,
    outputSchema: UndoRenterImportOutputSchema,
    authPolicy: async (auth) => {
      if (!auth) throw new Error("Authentication required.");
      const { role } = (await adminAuth.getUser(auth.uid)).customClaims || {};
      if (!["owner", "manager"].includes(role))
        throw new Error("Permission denied.");
    },
  },
  async ({ uploadBatchId }, { auth }) => {
    const { companyId, uid, role } = auth!.claims as any;

    const batchRef = db.doc(`uploadBatches/${uploadBatchId}`);
    const snapshot = await batchRef.get();

    if (!snapshot.exists) throw new Error("Upload batch not found.");
    const data = snapshot.data()!;
    if (data.companyId !== companyId)
      throw new Error(
        "Permission denied. This batch belongs to another company.",
      );

    const writeBatch = db.batch();
    data.docIds.forEach((id: string) => {
      const ref = db.doc(`renters/${id}`);
      writeBatch.delete(ref);
    });

    writeBatch.delete(batchRef); // Delete the tracking document
    await writeBatch.commit();

    await logAudit({
      action: "undoRenterImport",
      actorUid: uid,
      actorRole: role,
      companyId,
      targetPath: `uploadBatches/${uploadBatchId}`,
      before: data,
    });

    return { success: true };
  },
);
