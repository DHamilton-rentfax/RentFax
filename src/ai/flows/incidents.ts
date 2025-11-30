"use server";
/**
 * @fileOverview Genkit flows for managing incidents.
 */
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";

import { ai } from "@/ai/genkit";
import { admin, adminDB as db, adminAuth } from "@/firebase/server";

import { recomputeRenterScore } from "./risk-scorer";

const CreateIncidentSchema = z.object({
  renterId: z.string(),
  rentalId: z.string().optional().nullable(),
  type: z.string(), // Should be IncidentType
  severity: z.enum(["minor", "major", "severe"]),
  amount: z.number().optional(),
  notes: z.string().optional(),
  attachments: z
    .array(
      z.object({
        name: z.string(),
        path: z.string(),
        thumbPath: z.string().optional(),
      }),
    )
    .optional(),
});
export type CreateIncidentInput = z.infer<typeof CreateIncidentSchema>;

const CreateIncidentOutputSchema = z.object({
  id: z.string(),
  created: z.boolean(),
});
export type CreateIncidentOutput = z.infer<typeof CreateIncidentOutputSchema>;

export async function createIncident(
  input: CreateIncidentInput,
  auth?: FlowAuth,
): Promise<CreateIncidentOutput> {
  return await createIncidentFlow(input, auth);
}

const createIncidentFlow = ai.defineFlow(
  {
    name: "createIncidentFlow",
    inputSchema: CreateIncidentSchema,
    outputSchema: CreateIncidentOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error("Authentication is required.");
      const { role } =
        ((await adminAuth.getUser(auth.uid)).customClaims as any) || {};
      if (!["owner", "manager", "agent", "collections"].includes(role))
        throw new Error("Insufficient permissions.");
    },
  },
  async (incidentData, { auth }) => {
    if (!auth) throw new Error("Auth context is missing.");
    const { companyId } =
      ((await adminAuth.getUser(auth.uid)).customClaims as any) || {};
    if (!companyId) throw new Error("User is not associated with a company.");

    const { renterId } = incidentData;

    const renterDoc = await db.collection("renters").doc(renterId).get();
    if (!renterDoc.exists || renterDoc.data()?.companyId !== companyId) {
      throw new Error("Renter not found for this company.");
    }

    const payload = {
      ...incidentData,
      companyId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const newIncidentRef = await db.collection("incidents").add(payload);

    // After creating, recompute score
    await recomputeRenterScore({ renterId }, { auth });

    return { id: newIncidentRef.id, created: true };
  },
);
