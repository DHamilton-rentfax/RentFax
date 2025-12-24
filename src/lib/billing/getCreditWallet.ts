// src/lib/billing/getCreditWallet.ts
export async function getCreditWallet(userId: string) {
  return {
    balance: 0,
    plan: "FREE",
    overageEnabled: false,
  };
}
