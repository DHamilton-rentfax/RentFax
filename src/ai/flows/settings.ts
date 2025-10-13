"use server";
/**
 * @fileOverview Genkit flows for managing company settings.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";
import { adminDB as db, adminAuth } from "@/lib/firebase-admin";

const CompanySettingsSchema = z.object({
  bannerMessage: z.string().optional(),
});
export type CompanySettings = z.infer<typeof CompanySettingsSchema>;

const UpdateCompanySettingsInputSchema = z.object({
  bannerMessage: z.string().optional(),
});
export type UpdateCompanySettingsInput = z.infer<
  typeof UpdateCompanySettingsInputSchema
>;

export async function getCompanySettings(
  auth?: FlowAuth,
): Promise<CompanySettings | null> {
  return await getCompanySettingsFlow(undefined, auth);
}

const getCompanySettingsFlow = ai.defineFlow(
  {
    name: "getCompanySettingsFlow",
    inputSchema: z.void(),
    outputSchema: CompanySettingsSchema.nullable(),
    authPolicy: async (auth) => {
      if (!auth) throw new Error("Authentication is required.");
    },
  },
  async (_, { auth }) => {
    const { companyId } = auth!.claims as any;
    if (!companyId) return null;

    const docRef = db.doc(`companies/${companyId}`);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;

    const settings = docSnap.data()?.settings || {};
    return settings as CompanySettings;
  },
);

export async function updateCompanySettings(
  input: UpdateCompanySettingsInput,
  auth?: FlowAuth,
): Promise<void> {
  return await updateCompanySettingsFlow(input, auth);
}

const updateCompanySettingsFlow = ai.defineFlow(
  {
    name: "updateCompanySettingsFlow",
    inputSchema: UpdateCompanySettingsInputSchema,
    outputSchema: z.void(),
    authPolicy: async (auth) => {
      if (!auth) throw new Error("Authentication is required.");
      const { role } = (await adminAuth.getUser(auth.uid)).customClaims || {};
      if (!["owner", "manager"].includes(role))
        throw new Error("Permission denied.");
    },
  },
  async (payload, { auth }) => {
    const { companyId } = auth!.claims as any;
    if (!companyId) throw new Error("User is not part of a company.");

    const docRef = db.doc(`companies/${companyId}`);
    await docRef.set({ settings: payload }, { merge: true });
  },
);
