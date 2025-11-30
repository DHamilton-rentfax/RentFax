// src/lib/role-routing.ts

export function getDashboardPathForRole(role?: string | null): string {
  if (!role) return "/renter/dashboard";

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin";

    case "COMPANY_ADMIN":
    case "COMPANY_USER":
    case "COMPANY":
      return "/company";

    case "LANDLORD":
      // You can later change this to "/landlord" if/when we add that shell
      return "/company";

    case "AGENCY_ADMIN":
    case "AGENCY_USER":
    case "AGENCY":
      return "/agency";

    case "LEGAL_REVIEWER":
    case "LEGAL":
      return "/legal";

    case "RENTER":
    default:
      return "/renter/dashboard";
  }
}
