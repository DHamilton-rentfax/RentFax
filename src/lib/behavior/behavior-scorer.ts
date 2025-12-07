
export const BEHAVIOR_WEIGHTS: Record<string, number> = {
  FINANCIAL_RISK: 20,
  PROPERTY_DAMAGE: 30,
  UNAUTHORIZED_ACCESS: 40,
  ABANDONMENT: 50,
  THEFT: 70,
  ILLEGAL_ACTIVITY: 80,
  VIOLATION: 10,
  MISUSE: 15,
  MISC: 5,
};

export function scoreBehavior(behavior: string) {
  return BEHAVIOR_WEIGHTS[behavior] || 0;
}
