import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES, Role } from "@/types/roles";

function isCompanyRole(role: Role): role is
  | typeof ROLES.ORG_OWNER
  | typeof ROLES.ORG_STAFF {
  return (
    role === ROLES.ORG_OWNER ||
    role === ROLES.ORG_STAFF
  );
}

export async function requireCompanySession() {
  const session = cookies().get("__session")?.value;
  if (!session) redirect("/login");

  const decoded = await adminAuth.verifySessionCookie(session, true);
  const ctx = await getUserContext(decoded.uid);

  if (!isCompanyRole(ctx.role)) {
    redirect("/unauthorized");
  }

  return {
    userId: decoded.uid,
    role: ctx.role,
    orgId: ctx.orgId,
  };
}
