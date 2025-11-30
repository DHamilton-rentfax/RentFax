export const BILLING_RULES = {
  SEARCH: {
    cost: 1, // optional
    included: {
      FREE: 5,
      BASIC: 25,
      PRO: "unlimited",
      ENTERPRISE: "unlimited",
    },
  },
  IDENTITY_CHECK: {
    cost: 4.99, // or credits
    credits: 5,
  },
  FULL_REPORT: {
    cost: 19.99,
    credits: 20,
  },
};
