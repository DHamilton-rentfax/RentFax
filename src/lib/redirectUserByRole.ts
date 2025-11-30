export function redirectUserByRole({ router, role, email }: any) {
  if (role === "SUPER_ADMIN" || email === "info@rentfax.io") router.push("/admin");
  else if (role === "AGENCY") router.push("/agency-dashboard");
  else if (role === "COMPANY" || role === "COMPANY_ADMIN") router.push("/company/dashboard");
  else if (role === "RENTER" || role === "USER") router.push("/renter/dashboard");
  else router.push("/unauthorized");
}
