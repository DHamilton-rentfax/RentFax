import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type CreditReason =
  | "PAYG_REPORT_UNLOCK"
  | "PDPL_VERIFICATION"
  | "SUBSCRIPTION_REPORT"
  | "MONITORING_JOB"
  | "ADMIN_ADJUSTMENT";

type ConsumeCreditsParams = {
  orgId: string;
  amount: number;
  reason: CreditReason;
  userId: string;

  /** idempotency key (REQUIRED) */
  referenceId: string;

  /** Optional object reference */
  metadata?: {
    reportId?: string;
    intentId?: string;
    renterId?: string;
    [key: string]: any;
  };
};

type ConsumeCreditsResult = {
  remainingCredits: number;
};

/* -------------------------------------------------------------------------- */
/* CONSUME CREDITS (PRODUCTION GRADE)                                         */
/* -------------------------------------------------------------------------- */
export async function consumeCredits({
  orgId,
  amount,
  reason,
  userId,
  referenceId,
  metadata = {},
}: ConsumeCreditsParams): Promise<ConsumeCreditsResult> {
  if (amount <= 0) {
    throw new Error("Credit amount must be greater than zero.");
  }

  const orgRef = adminDb.collection("orgs").doc(orgId);
  const ledgerRef = orgRef.collection("creditLedger").doc(referenceId);

  return adminDb.runTransaction(async (tx) => {
    /* ---------------------------------------------------------------------- */
    /* IDEMPOTENCY CHECK                                                       */
    /* ---------------------------------------------------------------------- */
    const existing = await tx.get(ledgerRef);
    if (existing.exists) {
      const orgSnap = await tx.get(orgRef);
      const remaining = orgSnap.data()?.credits?.available ?? 0;
      return { remainingCredits: remaining };
    }

    /* ---------------------------------------------------------------------- */
    /* LOAD ORG                                                                */
    /* ---------------------------------------------------------------------- */
    const orgSnap = await tx.get(orgRef);
    if (!orgSnap.exists) {
      throw new Error("Organization not found.");
    }

    const org = orgSnap.data()!;

    /* ---------------------------------------------------------------------- */
    /* OVERRIDE MODE                                                           */
    /* ---------------------------------------------------------------------- */
    if (org.billing?.override === true) {
      tx.set(ledgerRef, {
        referenceId,
        amount: 0,
        reason,
        performedBy: userId,
        bypassed: true,
        metadata,
        createdAt: FieldValue.serverTimestamp(),
      });

      return {
        remainingCredits: org.credits?.available ?? 0,
      };
    }

    /* ---------------------------------------------------------------------- */
    /* BALANCE CHECK                                                           */
    /* ---------------------------------------------------------------------- */
    const available = org.credits?.available ?? 0;
    if (available < amount) {
      throw new Error(
        `Insufficient credits. Required ${amount}, available ${available}.`
      );
    }

    /* ---------------------------------------------------------------------- */
    /* APPLY CHANGES                                                           */
    /* ---------------------------------------------------------------------- */
    tx.update(orgRef, {
      "credits.available": FieldValue.increment(-amount),
      updatedAt: FieldValue.serverTimestamp(),
    });

    tx.set(ledgerRef, {
      referenceId,
      amount,
      reason,
      performedBy: userId,
      metadata,
      createdAt: FieldValue.serverTimestamp(),
    });

    return {
      remainingCredits: available - amount,
    };
  });
}
