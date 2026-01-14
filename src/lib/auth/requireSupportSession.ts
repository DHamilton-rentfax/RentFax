import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES, Role } from "@/types/roles";

function isSupportRole(role: Role): role is typeof ROLES.SUPPORT_ADMIN | typeof ROLES.SUPPORT_AGENT {
    return role === ROLES.SUPPORT_ADMIN || role === ROLES.SUPPORT_AGENT;
}

export async function requireSupportSession() {
    const session = cookies().get("__session")?.value;
    if (!session) redirect("/login");

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const ctx = await getUserContext(decoded.uid);

    if (!isSupportRole(ctx.role)) {
        redirect("/unauthorized");
    }

    return {
        userId: decoded.uid,
        role: ctx.role,
    };
}
