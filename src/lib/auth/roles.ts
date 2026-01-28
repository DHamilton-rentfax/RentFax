import { adminDb } from "@/firebase/server";
import { headers } from "next/headers";
import { DefaultRoleMap, User, UserRole } from "@/types";

/* =========================
   PERMISSION CHECKING
========================= */

export function hasPermission(
  user: User,
  requiredPermission: string
): boolean {
  // Super admins have all permissions
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // Explicit user-level overrides
  if (user.permissions?.includes(requiredPermission)) {
    return true;
  }

  // Role-based permissions
  const rolePermissions =
    DefaultRoleMap[user.role]?.permissions.some(
      (p) => p.key === requiredPermission
    ) ?? false;

  return rolePermissions;
}

/* =========================
   FIRESTORE SEEDING
========================= */

export async function seedRolesToFirestore() {
  const db = adminDb();
  if (!db) throw new Error("Admin DB not initialized");

  const rolesCollection = db.collection("roles");

  for (const role in DefaultRoleMap) {
    const roleData = DefaultRoleMap[role as UserRole];
    await rolesCollection.doc(role).set(roleData);
  }

  console.log("✅ Default roles seeded to Firestore.");
}

/* =========================
   REQUEST-TIME HELPERS
   (COMPAT LAYER)
========================= */

// These unblock existing imports across the app

export function getUserIdFromHeaders(): string | null {
  return headers().get("x-user-id");
}

export function getUserRoleFromHeaders(): UserRole | null {
  const role = headers().get("x-user-role");
  return role as UserRole | null;
}

export function requireSupportRole() {
  const role = getUserRoleFromHeaders();
  if (role !== UserRole.SUPPORT && role !== UserRole.SUPER_ADMIN) {
    throw new Error("Support role required");
  }
}

export function requireSuperAdminRole() {
  const role = getUserRoleFromHeaders();
  if (role !== UserRole.SUPER_ADMIN) {
    throw new Error("Super admin role required");
  }
}
