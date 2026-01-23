import { adminDb } from "@/firebase/server";
import { DefaultRoleMap, User, UserRole } from "@/types";

/**
 * Checks if a user has a specific permission.
 *
 * @param user The user object.
 * @param requiredPermission The permission to check for (e.g., "blogs:publish").
 * @returns True if the user has the permission, false otherwise.
 */
export function hasPermission(user: User, requiredPermission: string): boolean {
  // Super admins have all permissions
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Check for explicit user-level permission overrides
  if (user.permissions?.includes(requiredPermission)) {
    return true;
  }

  // Check the user's role-based permissions
  const rolePermissions = DefaultRoleMap[user.role]?.permissions.some(
    (p) => p.key === requiredPermission
  );

  return rolePermissions || false;
}

/**
 * Seeds the default roles and permissions to Firestore.
 * This should be run once during application setup.
 */
export async function seedRolesToFirestore() {
  const rolesCollection = adminDb.collection("roles");

  for (const role in DefaultRoleMap) {
    const roleData = DefaultRoleMap[role as UserRole];
    await rolesCollection.doc(role).set(roleData);
  }

  console.log("✅ Default roles seeded to Firestore.");
}
