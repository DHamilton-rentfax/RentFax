"use server";
/**
 * @fileOverview Genkit flows for calculating renter risk scores.
 */
import { z } from "genkit";
import { FlowAuth } from "genkit/flow";

import { ai } from "@/ai/genkit";
import { admin, adminDb as db, adminAuth } from "@/firebase/server";

import { logAudit } from "./audit";

type Reason = { code: string; message: string; weight: number };
type Incident = {
  type: string;
  severity: "minor" | "major" | "severe";
  amount?: number;
  createdAt?: any; // Timestamp
};

function monthsSince(ts: Date) {
  const now = new Date();
  return (
    (now.getFullYear() - ts.getFullYear()) * 12 +
    (now.getMonth() - ts.getMonth())
  );
}

/**
 * Deterministic score in [0, 100] with simple reason codes
 */
function computeScore(
  incidents: Incident[] = [],
  unpaidBalance = 0,
): { value: number; reasons: Reason[] } {
  let score = 100;
  const reasons: Reason[] = [];

  // Base deductions
  for (const inc of incidents) {
    const sevWeight =
      inc.severity === "severe" ? 25 : inc.severity === "major" ? 15 : 7;
    score -= sevWeight;
    reasons.push({
      code: `INC_${inc.severity.toUpperCase()}`,
      message: `Recent ${inc.severity} incident`,
      weight: sevWeight,
    });

    // Recency decay (older incidents hurt less)
    const created =
      (inc as any).createdAt instanceof Date
        ? (inc as any).createdAt
        : undefined;
    if (created) {
      const m = monthsSince(created);
      const decay = Math.min(10, Math.floor(m / 3)); // up to 10 pts back over time
      score += decay;
      if (decay > 0)
        reasons.push({
          code: "DECAY",
          message: `Aging incident (+${decay})`,
          weight: -decay,
        });
    }
  }

  // Unpaid balance
  if (unpaidBalance > 0) {
    const w = Math.min(30, Math.round(unpaidBalance / 50)); // $50 per point, cap 30
    score -= w;
    reasons.push({
      code: "UNPAID",
      message: `Unpaid balance $${unpaidBalance}`,
      weight: w,
    });
  }

  // Clamp
  score = Math.max(0, Math.min(100, score));

  // Top 3 absolute contributing reasons (positive weight only)
  const topReasons = reasons
    .filter((r) => r.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return { value: score, reasons: topReasons };
}

const RecomputeScoreSchema = z.object({
  renterId: z.string(),
});
export type RecomputeScoreInput = z.infer<typeof RecomputeScoreSchema>;

const RecomputeScoreOutputSchema = z.object({
  value: z.number(),
  reasons: z.array(z.any()),
});
export type RecomputeScoreOutput = z.infer<typeof RecomputeScoreOutputSchema>;

export async function recomputeRenterScore(
  input: RecomputeScoreInput,
  auth?: FlowAuth,
): Promise<RecomputeScoreOutput> {
  return await recomputeRenterScoreFlow(input, auth);
}

const recomputeRenterScoreFlow = ai.defineFlow(
  {
    name: "recomputeRenterScoreFlow",
    inputSchema: RecomputeScoreSchema,
    outputSchema: RecomputeScoreOutputSchema,
    authPolicy: async (auth, input) => {
      if (!auth) throw new Error("Authentication is required.");
    },
  },
  async ({ renterId }, { auth }) => {
    if (!auth) throw new Error("Auth context missing");
    const { companyId, uid, role } =
      ((await adminAuth.getUser(auth.uid)).customClaims as any) || {};
    if (!companyId) throw new Error("User is not associated with a company.");

    const renterRef = db.doc(`renters/${renterId}`);
    const renterSnap = await renterRef.get();
    if (!renterSnap.exists) throw new Error("Renter not found");
    const renterData = renterSnap.data()!;
    if (renterData.companyId !== companyId)
      throw new Error("Permission denied to recompute score for this renter.");

    const incSnap = await db
      .collection("incidents")
      .where("renterId", "==", renterId)
      .where("companyId", "==", companyId)
      .get();
    const incidents = incSnap.docs.map((d) => {
      const data = d.data();
      return { ...data, createdAt: data.createdAt?.toDate?.() || undefined };
    }) as Incident[];

    const result = computeScore(incidents, 0); // TODO: unpaidBalance
    const beforeData = {
      riskScore: renterData.riskScore,
      scoreReasons: renterData.scoreReasons,
    };
    const afterData = { riskScore: result.value, scoreReasons: result.reasons };

    await renterRef.set(
      {
        riskScore: result.value,
        scoreUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
        scoreReasons: result.reasons,
      },
      { merge: true },
    );

    await logAudit({
      actorUid: uid,
      actorRole: role,
      companyId: companyId,
      action: "recomputeRenterScore",
      targetPath: `renters/${renterId}`,
      before: beforeData,
      after: afterData,
    });

    return { value: result.value, reasons: result.reasons };
  },
);
