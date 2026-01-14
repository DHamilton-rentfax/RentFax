// src/lib/auth/requireAdminSession.ts
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES, Role } from "@/types/roles";

function isAdminRole(role: Role): role is
  | typeof ROLES.SUPER_ADMIN
  | typeof ROLES.SUPPORT_ADMIN {
  return (
    role === ROLES.SUPER_ADMIN ||
    role === ROLES.SUPPORT_ADMIN
  );
}

export async function requireAdminSession() {
  const session = cookies().get("__session")?.value;
  if (!session) redirect("/login");

  const decoded = await adminAuth.verifySessionCookie(session, true);
  const ctx = await getUserContext(decoded.uid);

  if (!isAdminRole(ctx.role)) {
    redirect("/unauthorized");
  }

  return {
    userId: decoded.uid,
    role: ctx.role,
  };
}
