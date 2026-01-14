export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  SUPPORT_ADMIN: "SUPPORT_ADMIN",
  SUPPORT_AGENT: "SUPPORT_AGENT",
  COMPLIANCE_AGENT: "COMPLIANCE_AGENT",
  CONTENT_MODERATOR: "CONTENT_MODERATOR",
  SALES_AGENT: "SALES_AGENT",

  ORG_OWNER: "ORG_OWNER",
  ORG_STAFF: "ORG_STAFF",

  RENTER: "RENTER",
  UNINITIALIZED: "UNINITIALIZED",

  // Added roles
  FRAUD_TEAM: "fraud_team",
  LISTINGS_TEAM: "listings_team",
  ONBOARDING_TEAM: "onboarding_team",
  SUPPORT_STAFF: "support_staff",

  // From resolvePersona
  COMPANY_ADMIN: "COMPANY_ADMIN",
  LANDLORD: "LANDLORD",

  // From getServerSession
  USER: "USER",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
