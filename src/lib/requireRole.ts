export type AllowedRole = "SUPERADMIN" | "OWNER" | "ADMIN" | "MANAGER";

/**
 * Enforces role-based access for API routes.
 * 
 * @param user The user object, which should contain a 'role' property.
 * This should come from a trusted source, like the data returned from requireUser().
 * @param allowed An array of roles that are permitted to access the route.
 * @throws An error if the user's role is not in the allowed list.
 */
export function requireRole(
  user: { role?: string | null },
  allowed: Array<AllowedRole>
) {
  if (!user.role || !allowed.includes(user.role as AllowedRole)) {
    // This error should be caught by a generic API error handler
    // and result in a 403 Forbidden response.
    throw new Error("Insufficient permissions");
  }
}
