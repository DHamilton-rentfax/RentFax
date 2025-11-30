export function getDashboardRedirect(email?: string | null, role?: string | null): string {
  if (!email) return "/login";

  const SUPER_ADMIN_EMAIL = "info@rentfax.io";

  if (email === SUPER_ADMIN_EMAIL) return "/admin/dashboard";

  switch (role) {
    case "COMPANY":
    case "INDIVIDUAL":
      return "/dashboard/company";
    case "RENTER":
      return "/renter/dashboard";
    case "ADMIN":
      return "/admin/dashboard";
    default:
      return "/onboarding/verify";
  }
}
