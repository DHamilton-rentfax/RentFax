'use server';
/**
 * @fileOverview Genkit flows for creating and accepting company invitations.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as admin from 'firebase-admin';
import {v4 as uuid} from 'uuid';
import {FlowAuth} from 'genkit/flow';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

type Role = 'owner' | 'manager' | 'agent' | 'collections' | 'renter';

// Flow to create an invitation
const CreateInviteInputSchema = z.object({
  email: z.string().email('A valid email is required.'),
  role: z.enum(['manager', 'agent', 'collections']),
});
export type CreateInviteInput = z.infer<typeof CreateInviteInputSchema>;

const CreateInviteOutputSchema = z.object({
  inviteId: z.string(),
  acceptUrl: z.string(),
});
export type CreateInviteOutput = z.infer<typeof CreateInviteOutputSchema>;

export async function createInvite(input: CreateInviteInput, auth?: FlowAuth): Promise<CreateInviteOutput> {
  return await createInviteFlow(input, auth);
}

const createInviteFlow = ai.defineFlow(
  {
    name: 'createInviteFlow',
    inputSchema: CreateInviteInputSchema,
    outputSchema: CreateInviteOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error('Authentication is required.');
      const caller = await admin.auth().getUser(auth.uid);
      const claims = (caller.customClaims || {}) as any;
      if (!claims.role || !claims.companyId) throw new Error('Caller must belong to a company.');
      if (!['owner', 'manager'].includes(claims.role)) throw new Error('Only owner or manager can create invites.');
    },
  },
  async ({email, role}, {auth}) => {
    if (!auth) throw new Error('Auth context missing');
    const caller = await admin.auth().getUser(auth.uid);
    const claims = caller.customClaims!;

    const token = uuid();
    const inviteId = token; // Using token as ID is convenient
    const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days

    await db.doc(`invites/${inviteId}`).set({
      email: email.toLowerCase().trim(),
      companyId: claims.companyId,
      role,
      status: 'pending',
      createdBy: auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromMillis(expiresAt),
    });

    const acceptUrl = `${process.env.INVITE_ACCEPT_BASE_URL || 'http://localhost:9002'}/invite/${token}`;
    return {inviteId, acceptUrl};
  }
);

// Flow to accept an invitation
const AcceptInviteInputSchema = z.object({
  token: z.string().describe('The invitation token from the URL.'),
});
export type AcceptInviteInput = z.infer<typeof AcceptInviteInputSchema>;

const AcceptInviteOutputSchema = z.object({
  ok: z.boolean(),
  companyId: z.string(),
  role: z.string(),
});
export type AcceptInviteOutput = z.infer<typeof AcceptInviteOutputSchema>;

export async function acceptInvite(input: AcceptInviteInput, auth?: FlowAuth): Promise<AcceptInviteOutput> {
  return await acceptInviteFlow(input, auth);
}

const acceptInviteFlow = ai.defineFlow(
  {
    name: 'acceptInviteFlow',
    inputSchema: AcceptInviteInputSchema,
    outputSchema: AcceptInviteOutputSchema,
    authPolicy: (auth, input) => {
      if (!auth) throw new Error('Authentication is required to accept an invite.');
    },
  },
  async ({token}, {auth}) => {
    if (!auth) throw new Error('Auth context missing.');

    const docRef = db.doc(`invites/${token}`);
    const doc = await docRef.get();

    if (!doc.exists) throw new Error('Invite not found or invalid.');

    const inv = doc.data()!;
    if (inv.status !== 'pending') throw new Error('This invite has already been used.');
    if (Date.now() > inv.expiresAt.toMillis()) throw new Error('This invite has expired.');

    const user = await admin.auth().getUser(auth.uid);
    if ((user.email || '').toLowerCase() !== inv.email) {
      throw new Error('This invite is for a different email address.');
    }

    // Set claims and mark invite accepted
    await admin.auth().setCustomUserClaims(auth.uid, {role: inv.role, companyId: inv.companyId});
    await admin.auth().revokeRefreshTokens(auth.uid);
    await docRef.update({status: 'accepted', acceptedBy: auth.uid, acceptedAt: admin.firestore.FieldValue.serverTimestamp()});

    return {ok: true, companyId: inv.companyId, role: inv.role};
  }
);
