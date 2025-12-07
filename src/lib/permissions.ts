export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "C_LEVEL"
  | "DIRECTOR"
  | "FRAUD_ANALYST"
  | "SUPPORT"
  | "COMPLIANCE"
  | "FINANCE"
  | "COMPANY_OWNER"
  | "COMPANY_ADMIN"
  | "COMPANY_STAFF";

export type Permission =
  | "view_admin_dashboard"
  | "manage_companies"
  | "view_renters"
  | "edit_renters"
  | "manage_incidents"
  | "review_disputes"
  | "view_fraud_panel"
  | "manage_rules"
  | "manage_system_settings"
  | "view_logs";

export const RolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "view_admin_dashboard",
    "manage_companies",
    "view_renters",
    "edit_renters",
    "manage_incidents",
    "review_disputes",
    "view_fraud_panel",
    "manage_rules",
    "manage_system_settings",
    "view_logs",
  ],

  ADMIN: [
    "view_admin_dashboard",
    "view_renters",
    "manage_incidents",
    "review_disputes",
    "view_logs",
  ],

  C_LEVEL: [
    "view_admin_dashboard",
    "view_fraud_panel",
    "view_renters",
    "view_logs",
  ],

  DIRECTOR: ["view_admin_dashboard", "view_renters", "review_disputes"],

  FRAUD_ANALYST: ["view_fraud_panel", "view_renters"],

  SUPPORT: ["view_renters"],

  COMPLIANCE: ["view_renters", "review_disputes"],

  FINANCE: ["view_logs"],

  COMPANY_OWNER: ["view_renters"],

  COMPANY_ADMIN: ["view_renters"],

  COMPANY_STAFF: [],
};

export function hasPermission(role: UserRole, perm: Permission) {
  return RolePermissions[role]?.includes(perm);
}
