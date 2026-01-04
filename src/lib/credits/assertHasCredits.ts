import { getCreditBalance } from "./getCreditBalance";
import { recordLedgerEvent } from "@/lib/ledger/recordLedgerEvent";

type CreditGuardInput = {
  userId: string;
  cost: number; // credits required (positive integer)
  action: "SEARCH" | "REPORT" | "AI";
  relatedObject?: string; // reportId, searchId
};

export async function assertHasCredits({
  userId,
  cost,
  action,
  relatedObject,
}: CreditGuardInput) {
  const balance = await getCreditBalance(userId);

  if (balance < cost) {
    // 🔒 Ledger record for blocked attempt
    await recordLedgerEvent({
      action: "CREDIT_BLOCKED_ATTEMPT",
      actorId: userId,
      actorType: "user",
      amount: 0,
      reason: `Blocked ${action}: insufficient credits`,
      relatedObject,
    });

    throw new Error("INSUFFICIENT_CREDITS");
  }

  // ✅ Consume credits
  await recordLedgerEvent({
    action: "CREDIT_CONSUMED",
    actorId: userId,
    actorType: "user",
    amount: -cost,
    reason: `Consumed for ${action}`,
    relatedObject,
  });
}
