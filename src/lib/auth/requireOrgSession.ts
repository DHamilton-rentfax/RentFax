// src/lib/auth/requireOrgSession.ts
import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES, Role } from "@/types/roles";

function isOrgRole(
  role: Role
): role is typeof ROLES.ORG_OWNER | typeof ROLES.ORG_STAFF {
  return (
    role === ROLES.ORG_OWNER ||
    role === ROLES.ORG_STAFF
  );
}

export async function requireOrgSession() {
  const session = cookies().get("__session")?.value;
  if (!session) redirect("/login");

  const decoded = await adminAuth.verifySessionCookie(session, true);
  const ctx = await getUserContext(decoded.uid);

  if (!isOrgRole(ctx.role)) {
    redirect("/unauthorized");
  }

  return {
    userId: decoded.uid,
    role: ctx.role,
    orgId: ctx.orgId,
  };
}
