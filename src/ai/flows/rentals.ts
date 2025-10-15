"use server";
/**
 * @fileOverview Genkit flows for managing rental records.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";
import { admin, adminDB as db, adminAuth } from "@/firebase/client-admin";

const UpsertRentalSchema = z.object({
  id: z.string().optional(),
  renterId: z.string(),
  vehicleId: z.string(),
  startAt: z.string(),
  endAt: z.string(),
  status: z.enum(["active", "completed", "cancelled", "overdue"]),
  depositAmount: z.number().optional(),
  dailyRate: z.number().optional(),
  notes: z.string().optional(),
  contractUrl: z.string().optional(),
});
export type UpsertRentalInput = z.infer<typeof UpsertRentalSchema>;

const UpsertRentalOutputSchema = z.object({
  id: z.string(),
  updated: z.boolean().optional(),
  created: z.boolean().optional(),
});
export type UpsertRentalOutput = z.infer<typeof UpsertRentalOutputSchema>;

export async function upsertRental(
  input: UpsertRentalInput,
  auth?: FlowAuth,
): Promise<UpsertRentalOutput> {
  return await upsertRentalFlow(input, auth);
}

const upsertRentalFlow = ai.defineFlow(
  {
    name: "upsertRentalFlow",
    inputSchema: UpsertRentalSchema,
    outputSchema: UpsertRentalOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error("Authentication is required.");
      const { role } =
        ((await adminAuth.getUser(auth.uid)).customClaims as any) || {};
      if (!["owner", "manager", "agent"].includes(role))
        throw new Error("Insufficient permissions.");
    },
  },
  async (rentalData, { auth }) => {
    if (!auth) throw new Error("Auth context is missing.");
    const { companyId } =
      ((await adminAuth.getUser(auth.uid)).customClaims as any) || {};
    if (!companyId) throw new Error("User is not associated with a company.");

    const { id, ...data } = rentalData;

    // Validate renter exists in the same company
    const renterDoc = await db.collection("renters").doc(data.renterId).get();
    if (!renterDoc.exists || renterDoc.data()?.companyId !== companyId) {
      throw new Error("Renter not found for this company.");
    }

    const payload = {
      ...data,
      companyId,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (id) {
      const rentalRef = db.collection("rentals").doc(id);
      await rentalRef.update(payload);
      return { id, updated: true };
    } else {
      const newRentalRef = await db.collection("rentals").add({
        ...payload,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { id: newRentalRef.id, created: true };
    }
  },
);

const DeleteRentalInputSchema = z.object({ id: z.string() });
export type DeleteRentalInput = z.infer<typeof DeleteRentalInputSchema>;

const DeleteRentalOutputSchema = z.object({ deleted: z.boolean() });
export type DeleteRentalOutput = z.infer<typeof DeleteRentalOutputSchema>;

export async function deleteRental(
  input: DeleteRentalInput,
  auth?: FlowAuth,
): Promise<DeleteRentalOutput> {
  return await deleteRentalFlow(input, auth);
}

const deleteRentalFlow = ai.defineFlow(
  {
    name: "deleteRentalFlow",
    inputSchema: DeleteRentalInputSchema,
    outputSchema: DeleteRentalOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error("Authentication is required.");
      const { uid } = auth;
      const { companyId, role } =
        ((await adminAuth.getUser(uid)).customClaims as any) || {};
      if (!["owner", "manager"].includes(role))
        throw new Error("Insufficient permissions.");

      const rentalDoc = await db.collection("rentals").doc(input.id).get();
      if (!rentalDoc.exists) throw new Error("Rental not found");
      if (rentalDoc.data()?.companyId !== companyId) {
        throw new Error("Permission denied to delete this rental.");
      }
    },
  },
  async ({ id }) => {
    await db.collection("rentals").doc(id).delete();
    return { deleted: true };
  },
);
