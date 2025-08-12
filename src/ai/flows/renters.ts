'use server';
/**
 * @fileOverview Genkit flows for managing renter records, including bulk import.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { FlowAuth } from 'genkit/flow';
import { admin, dbAdmin as db, authAdmin } from '@/lib/firebase-admin';
import { logAudit } from './audit';

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

const UpsertRenterOutputSchema = z.object({ id: z.string(), created: z.boolean(), updated: z.boolean() });
export type UpsertRenterOutput = z.infer<typeof UpsertRenterOutputSchema>;

export async function upsertRenter(input: Renter, auth?: FlowAuth): Promise<UpsertRenterOutput> {
  return await upsertRenterFlow(input, auth);
}

const upsertRenterFlow = ai.defineFlow(
  {
    name: 'upsertRenterFlow',
    inputSchema: RenterSchema,
    outputSchema: UpsertRenterOutputSchema,
    authPolicy: async (auth) => {
      if (!auth) throw new Error('Authentication required.');
      const { role } = (await authAdmin.getUser(auth.uid)).customClaims || {};
      if (!['owner', 'manager', 'agent'].includes(role)) throw new Error('Permission denied.');
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
      await logAudit({ action: 'updateRenter', actorUid: uid, actorRole: role, companyId, targetPath: `renters/${id}`, before: (await ref.get()).data(), after: renterData });
      return { id, created: false, updated: true };
    } else {
      const ref = db.collection('renters').doc();
      await ref.set({ ...renterData, riskScore: 100, scoreReasons: [], createdAt: admin.firestore.FieldValue.serverTimestamp() });
      await logAudit({ action: 'createRenter', actorUid: uid, actorRole: role, companyId, targetPath: `renters/${ref.id}`, after: renterData });
      return { id: ref.id, created: true, updated: false };
    }
  }
);


// --- Bulk Import Renters ---

const ImportRentersInputSchema = z.object({
  renters: z.array(z.object({
      name: z.string(),
      email: z.string().optional(),
      licenseNumber: z.string().optional(),
      licenseState: z.string().optional(),
      dob: z.string().optional(),
      phone: z.string().optional(),
      notes: z.string().optional(),
  })).max(500, 'Cannot import more than 500 renters at a time.'),
});
export type ImportRentersInput = z.infer<typeof ImportRentersInputSchema>;

const ImportRentersOutputSchema = z.object({
  success: z.boolean(),
  count: z.number(),
});
export type ImportRentersOutput = z.infer<typeof ImportRentersOutputSchema>;


export async function importRenters(input: ImportRentersInput, auth?: FlowAuth): Promise<ImportRentersOutput> {
    return await importRentersFlow(input, auth);
}

const importRentersFlow = ai.defineFlow(
  {
    name: 'importRentersFlow',
    inputSchema: ImportRentersInputSchema,
    outputSchema: ImportRentersOutputSchema,
    authPolicy: async (auth) => {
        if (!auth) throw new Error('Authentication required.');
        const { role } = (await authAdmin.getUser(auth.uid)).customClaims || {};
        if (!['owner', 'manager'].includes(role)) throw new Error('Permission denied. Must be an owner or manager.');
    },
  },
  async ({ renters }, { auth }) => {
    const { companyId, uid, role } = auth!.claims as any;
    const batch = db.batch();
    const now = admin.firestore.FieldValue.serverTimestamp();

    renters.forEach(renter => {
      const ref = db.collection('renters').doc();
      batch.set(ref, {
        ...renter,
        companyId,
        riskScore: 100, // Default score for new imports
        scoreReasons: [],
        createdAt: now,
        updatedAt: now,
      });
    });

    await batch.commit();

    await logAudit({
        action: 'importRenters',
        actorUid: uid,
        actorRole: role,
        companyId,
        targetPath: `companies/${companyId}`,
        after: { count: renters.length },
    });
    
    return { success: true, count: renters.length };
  }
);
