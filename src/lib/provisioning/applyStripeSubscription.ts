export type ProvisioningConfig = {
  plan: "FREE" | "STARTER" | "PRO" | "ENTERPRISE";

  credits: {
    monthlyAllocation: number; // how many credits are granted on renewal
  };

  seats: {
    limit: number | null; // null = unlimited
  };

  limits: {
    searchesPerMonth: number | null;
    reportsPerMonth: number | null;
    pendingReports: number;
    externalAccounts: number;
  };

  features: {
    aiRisk: boolean;
    aiSummary: boolean;
    disputeTools: boolean;
    exportPDF: boolean;
    exportCSV: boolean;
    impersonation: boolean;
  };
};

export function mapPlanToProvisioning(planKey: string): ProvisioningConfig {
  switch (planKey) {
    case "price_free_monthly":
      return {
        plan: "FREE",

        credits: {
          monthlyAllocation: 0,
        },

        seats: {
          limit: 1,
        },

        limits: {
          searchesPerMonth: 3,
          reportsPerMonth: 0,
          pendingReports: 0,
          externalAccounts: 0,
        },

        features: {
          aiRisk: false,
          aiSummary: false,
          disputeTools: false,
          exportPDF: false,
          exportCSV: false,
          impersonation: false,
        },
      };

    case "price_pro_monthly":
      return {
        plan: "PRO",

        credits: {
          monthlyAllocation: 20,
        },

        seats: {
          limit: 5,
        },

        limits: {
          searchesPerMonth: null, // unlimited
          reportsPerMonth: null,  // gated by credits
          pendingReports: 25,
          externalAccounts: 5,
        },

        features: {
          aiRisk: true,
          aiSummary: true,
          disputeTools: true,
          exportPDF: true,
          exportCSV: true,
          impersonation: true,
        },
      };

    // STARTER / ENTERPRISE intentionally added later
    // to avoid premature entitlement promises

    default:
      throw new Error(`Unknown Stripe plan key: ${planKey}`);
  }
}
