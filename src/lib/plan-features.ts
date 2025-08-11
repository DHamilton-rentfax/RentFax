
export type Plan = 'starter' | 'pro' | 'enterprise';
export type CompanyStatus = 'active' | 'grace' | 'locked';

export function nextStatus(isPaid: boolean, wasActive: boolean): CompanyStatus {
  if (isPaid) return 'active';
  return wasActive ? 'grace' : 'locked';
}

// Feature flags per plan (adjust to your app)
export const PLAN_FEATURES: Record<Plan, Record<string, boolean>> = {
  starter: {
    ai_assistant: false,
    advanced_reports: false,
    collections_export: true,
    fraud_graph: false,
  },
  pro: {
    ai_assistant: true,
    advanced_reports: true,
    collections_export: true,
    fraud_graph: false,
  },
  enterprise: {
    ai_assistant: true,
    advanced_reports: true,
    collections_export: true,
    fraud_graph: true,
  },
};
