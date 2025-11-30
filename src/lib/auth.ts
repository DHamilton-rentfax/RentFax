import { User, UserRole, DefaultRoleMap } from "@/types";

/**
 * Checks if a user has a specific permission.
 *
 * @param user The user object, which should include their role and any explicit permissions.
 * @param requiredPermission The permission key to check for (e.g., "blogs:publish").
 * @returns True if the user has the permission, false otherwise.
 */
export function hasPermission(user: User, requiredPermission: string): boolean {
  if (!user || !user.role) {
    return false;
  }

  // Super Admins have all permissions implicitly.
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  const rolePermissions = DefaultRoleMap[user.role]?.permissions.map(p => p.key) || [];

  // Check if the role's default permissions include the required one, or a wildcard.
  if (rolePermissions.includes(requiredPermission) || rolePermissions.includes('*')) {
    return true;
  }

  // Check for explicit user-specific permission overrides.
  if (user.permissions?.includes(requiredPermission)) {
    return true;
  }

  return false;
}
