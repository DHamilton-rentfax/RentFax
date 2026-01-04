import { LedgerAction } from "@/types/ledger";
import { recordLedgerEvent } from "@/lib/ledger/recordLedgerEvent";

async function getAvailableCredits(userId: string): Promise<number> {
  // In a real app, this would query a database or a billing service.
  // For now, we'll return a static value.
  console.log(`Checking credits for user ${userId}`);
  return 10;
}

type AssertHasCreditsParams = {
  userId: string;
  cost: number;
  actionType: LedgerAction;
  relatedObject?: string;
};

export async function assertHasCredits({ userId, cost, actionType, relatedObject }: AssertHasCreditsParams) {
  const availableCredits = await getAvailableCredits(userId);

  if (availableCredits < cost) {
    await recordLedgerEvent({
      action: "CREDIT_BLOCKED_ATTEMPT",
      actorId: userId,
      actorType: 'user',
      amount: cost,
      reason: `Insufficient credits for ${actionType}`,
      relatedObject,
    });
    throw new Error("Insufficient credits");
  }
}
