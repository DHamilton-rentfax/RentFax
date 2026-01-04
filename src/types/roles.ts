export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  PROPERTY_MANAGER: "PROPERTY_MANAGER",
  COMPANY: "COMPANY",
  RENTER: "RENTER",
  USER: "USER",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];
