import { consumeCredits } from "@/lib/billing/consumeCredits";

type RequireCreditsArgs = {
  orgId: string;
  amount?: number;
  reason: "SEARCH" | "REPORT_UNLOCK" | "REPORT_UPDATE";
  reportNameId?: string;
};

export async function requireCredits({
  orgId,
  amount = 1,
  reason,
  reportNameId,
}: RequireCreditsArgs) {
  const result = await consumeCredits(orgId, amount, { reason, reportNameId });

  if (!result.ok) {
    // ✅ keeps your API catch blocks working if they check message
    const err = new Error("INSUFFICIENT_CREDITS");
    throw err;
  }
}
