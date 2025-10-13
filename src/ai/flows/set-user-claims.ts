"use server";
/**
 * @fileOverview A Genkit flow to set custom claims for a Firebase user.
 * Restricted to users with 'super_admin' or 'owner' roles.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";
import { admin, adminDB as db, adminAuth } from "@/lib/firebase-admin";

type Role =
  | "super_admin"
  | "admin"
  | "editor"
  | "reviewer"
  | "user"
  | "rental_client"
  | "banned";

const SetUserClaimsInputSchema = z.object({
  uid: z.string().describe("The UID of the user to set claims for."),
  role: z.string().describe("The role to assign to the user."),
  companyId: z
    .string()
    .optional()
    .describe("The company ID to associate with the user."),
});
export type SetUserClaimsInput = z.infer<typeof SetUserClaimsInputSchema>;

const SetUserClaimsOutputSchema = z.object({ success: z.boolean() });
export type SetUserClaimsOutput = z.infer<typeof SetUserClaimsOutputSchema>;

export async function setUserClaims(
  input: SetUserClaimsInput,
  auth?: FlowAuth,
): Promise<SetUserClaimsOutput> {
  return await setUserClaimsFlow(input, auth);
}

const setUserClaimsFlow = ai.defineFlow(
  {
    name: "setUserClaimsFlow",
    inputSchema: SetUserClaimsInputSchema,
    outputSchema: z.object({ success: z.boolean() }),
    authPolicy: async (auth, input) => {
      if (!auth) {
        throw new Error("Authentication is required.");
      }
      const caller = await adminAuth.getUser(auth.uid);
      const callerClaims = caller.customClaims || {};
      const callerRole = callerClaims?.role as Role | undefined;

      if (!callerRole) {
        throw new Error("Permission denied: Caller has no assigned role.");
      }
      if (!(callerRole === "super_admin" || callerRole === "admin")) {
        throw new Error("Permission denied: Insufficient role.");
      }

      if (callerRole === "admin") {
        if (!input.companyId || callerClaims.companyId !== input.companyId) {
          throw new Error(
            "Permission denied: Admins can only set claims for their own company.",
          );
        }
        if (input.role === "super_admin") {
          throw new Error(
            "Permission denied: Admins cannot assign the super_admin role.",
          );
        }
      }
    },
  },
  async ({ uid, role, companyId }, { auth }) => {
    if (!auth) throw new Error("Auth context missing");

    const caller = await adminAuth.getUser(auth.uid);
    const callerClaims = caller.customClaims || {};

    // Set custom claims
    const finalCompanyId = companyId || callerClaims.companyId;
    if (!finalCompanyId)
      throw new Error("Company ID is required when caller is not an admin.");

    await adminAuth.setCustomUserClaims(uid, {
      role,
      companyId: finalCompanyId,
    });
    // Force token refresh on client
    await adminAuth.revokeRefreshTokens(uid);

    return { success: true };
  },
);
