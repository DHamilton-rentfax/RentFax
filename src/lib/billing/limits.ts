
export const PLAN_LIMITS: Record<string, Record<string, number>> = {
  free: {
    verifications: 5,
    reports: 3,
    searches: 10,
  },
  starter: {
    verifications: 50,
    reports: 25,
    searches: 100,
  },
  pro: {
    verifications: 200,
    reports: 100,
    searches: 500,
  },
  enterprise: {
    verifications: Infinity,
    reports: Infinity,
    searches: Infinity,
  },
};
