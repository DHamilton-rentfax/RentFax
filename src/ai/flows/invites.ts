"use server";
/**
 * @fileOverview Genkit flows for creating and accepting company invitations.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { v4 as uuid } from "uuid";
import { FlowAuth } from "genkit/flow";
import { admin, adminDB as db, adminAuth } from "@/firebase/client-admin";

// Canonical Role Hierarchy
type Role =
  | "super_admin"
  | "admin"
  | "editor"
  | "reviewer"
  | "user"
  | "rental_client"
  | "banned"
  | "content_manager";
const roles: Role[] = [
  "super_admin",
  "admin",
  "editor",
  "reviewer",
  "user",
  "rental_client",
  "banned",
  "content_manager",
];

// Flow to create an invitation
const CreateInviteInputSchema = z.object({
  email: z.string().email("A valid email is required."),
  role: z.enum(["admin", "editor", "reviewer", "user", "content_manager"]),
});
export type CreateInviteInput = z.infer<typeof CreateInviteInputSchema>;

const CreateInviteOutputSchema = z.object({
  inviteId: z.string(),
  acceptUrl: z.string(),
});
export type CreateInviteOutput = z.infer<typeof CreateInviteOutputSchema>;

export async function createInvite(
  input: CreateInviteInput,
  auth?: FlowAuth,
): Promise<CreateInviteOutput> {
  return await createInviteFlow(input, auth);
}

const createInviteFlow = ai.defineFlow(
  {
    name: "createInviteFlow",
    inputSchema: CreateInviteInputSchema,
    outputSchema: CreateInviteOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error("Authentication is required.");
      const caller = await adminAuth.getUser(auth.uid);
      const claims = (caller.customClaims || {}) as any;
      if (!claims.role || !claims.companyId)
        throw new Error("Caller must belong to a company.");
      if (!["super_admin", "admin"].includes(claims.role))
        throw new Error("Only admins can create invites.");
    },
  },
  async ({ email, role }, { auth }) => {
    if (!auth) throw new Error("Auth context missing");
    const caller = await adminAuth.getUser(auth.uid);
    const claims = caller.customClaims!;

    const token = uuid();
    const inviteId = token; // Using token as ID is convenient
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    await db.doc(`invites/${inviteId}`).set({
      email: email.toLowerCase().trim(),
      companyId: claims.companyId,
      role,
      token,
      status: "pending",
      createdBy: auth.uid,
      createdAt: admin.firestore.Timestamp.fromDate(now),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    });

    const acceptUrl = `${process.env.INVITE_ACCEPT_BASE_URL || "http://localhost:9002"}/invite/${token}`;
    return { inviteId, acceptUrl };
  },
);

// Flow to accept an invitation
const AcceptInviteInputSchema = z.object({
  token: z.string().describe("The invitation token from the URL."),
});
export type AcceptInviteInput = z.infer<typeof AcceptInviteInputSchema>;

const AcceptInviteOutputSchema = z.object({
  ok: z.boolean(),
  companyId: z.string(),
  role: z.string(),
});
export type AcceptInviteOutput = z.infer<typeof AcceptInviteOutputSchema>;

export async function acceptInvite(
  input: AcceptInviteInput,
  auth?: FlowAuth,
): Promise<AcceptInviteOutput> {
  return await acceptInviteFlow(input, auth);
}

const acceptInviteFlow = ai.defineFlow(
  {
    name: "acceptInviteFlow",
    inputSchema: AcceptInviteInputSchema,
    outputSchema: AcceptInviteOutputSchema,
    authPolicy: (auth, input) => {
      if (!auth)
        throw new Error("Authentication is required to accept an invite.");
    },
  },
  async ({ token }, { auth }) => {
    if (!auth) throw new Error("Auth context missing.");

    const docRef = db.doc(`invites/${token}`);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error("Invite not found or invalid.");

    const inv = doc.data()!;
    if (inv.status !== "pending")
      throw new Error("This invite has already been used.");
    if (inv.expiresAt && inv.expiresAt.toDate() < new Date()) {
      throw new Error("This invite has expired.");
    }

    const user = await adminAuth.getUser(auth.uid);
    if ((user.email || "").toLowerCase() !== inv.email) {
      throw new Error("This invite is for a different email address.");
    }

    // Set claims and mark invite accepted
    await adminAuth.setCustomUserClaims(auth.uid, {
      role: inv.role,
      companyId: inv.companyId,
    });
    await adminAuth.revokeRefreshTokens(auth.uid);
    await docRef.update({
      status: "accepted",
      acceptedBy: auth.uid,
      acceptedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { ok: true, companyId: inv.companyId, role: inv.role };
  },
);
