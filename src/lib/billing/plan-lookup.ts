export const STRIPE_PRICE_TO_PLAN: Record<string, string> = {
  price_free_monthly: "free",

  // $149 Basic Plan
  price_basic_monthly: "basic",

  // $299 Pro Plan
  price_pro_monthly: "pro",

  // Enterprise is handled manually (no price ID)
};
