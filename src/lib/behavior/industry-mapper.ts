
export function mapRiskToIndustry(normalizedBehavior: string, industry: string) {
  const riskMatrix: Record<string, Record<string, string>> = {
    CAR: {
      FINANCIAL_RISK: "MEDIUM",
      PROPERTY_DAMAGE: "HIGH",
      UNAUTHORIZED_ACCESS: "SEVERE",
      ABANDONMENT: "SEVERE",
      THEFT: "SEVERE",
      ILLEGAL_ACTIVITY: "HIGH",
      VIOLATION: "LOW",
    },

    PROPERTY: {
      FINANCIAL_RISK: "HIGH",
      PROPERTY_DAMAGE: "HIGH",
      UNAUTHORIZED_ACCESS: "HIGH",
      ABANDONMENT: "SEVERE",
      THEFT: "HIGH",
      ILLEGAL_ACTIVITY: "SEVERE",
      VIOLATION: "LOW",
    },

    EQUIPMENT: {
      FINANCIAL_RISK: "MEDIUM",
      PROPERTY_DAMAGE: "SEVERE",
      UNAUTHORIZED_ACCESS: "SEVERE",
      ABANDONMENT: "SEVERE",
      THEFT: "SEVERE",
      ILLEGAL_ACTIVITY: "HIGH",
      VIOLATION: "LOW",
    },

    SHORT_TERM: {
      FINANCIAL_RISK: "MEDIUM",
      PROPERTY_DAMAGE: "HIGH",
      UNAUTHORIZED_ACCESS: "HIGH",
      PARTY: "HIGH",
      ABANDONMENT: "HIGH",
      ILLEGAL_ACTIVITY: "SEVERE",
    },
  };

  return (
    riskMatrix[industry]?.[normalizedBehavior] || "MEDIUM"
  );
}
