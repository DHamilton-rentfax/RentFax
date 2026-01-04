import { adminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";

export type ConsumeCreditsContext = {
  reportNameId?: string;
  reason: "SEARCH" | "REPORT_UNLOCK" | "REPORT_UPDATE";
};

export type ConsumeCreditsResult =
  | { ok: true }
  | { ok: false; code: "NO_CREDITS" };

export async function consumeCredits(
  orgId: string,
  amount = 1,
  context: ConsumeCreditsContext
): Promise<ConsumeCreditsResult> {
  const ledgerRef = adminDb.collection("ledger");

  // ✅ Test expects orgId when no reportNameId is present
  const relatedObject = context.reportNameId ?? orgId;

  const attempt = await adminDb.runTransaction(async (tx) => {
    const ledgerSnap = await tx.get(ledgerRef.where("orgId", "==", orgId));

    let balance = 0;
    ledgerSnap.forEach((doc) => {
      const data = doc.data();
      if (typeof data.amount === "number") balance += data.amount;
    });

    if (balance < amount) {
      return { allowed: false as const, balance };
    }

    tx.set(ledgerRef.doc(), {
      orgId,
      action: "CREDIT_CONSUMED",
      actorType: "system",
      amount: -amount,
      reason: context.reason,
      relatedObject, // ✅ FIXED
      balanceBefore: balance,
      balanceAfter: balance - amount,
      createdAt: Timestamp.now(),
    });

    return { allowed: true as const };
  });

  if (!attempt.allowed) {
    await adminDb.runTransaction(async (tx) => {
      tx.set(ledgerRef.doc(), {
        orgId,
        action: "CREDIT_BLOCKED_ATTEMPT",
        actorType: "system",
        amount: 0,
        reason: context.reason,
        relatedObject, // ✅ FIXED
        balanceAtAttempt: attempt.balance,
        createdAt: Timestamp.now(),
      });
    });

    return { ok: false, code: "NO_CREDITS" };
  }

  return { ok: true };
}
