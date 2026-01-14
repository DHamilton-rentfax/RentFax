import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES, Role } from "@/types/roles";

function isAgencyRole(role: Role): role is typeof ROLES.COLLECTION_AGENCY {
    return role === ROLES.COLLECTION_AGENCY;
}

export async function requireAgencySession() {
    const session = cookies().get("__session")?.value;
    if (!session) redirect("/login");

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const ctx = await getUserContext(decoded.uid);

    if (!isAgencyRole(ctx.role)) {
        redirect("/unauthorized");
    }

    return {
        userId: decoded.uid,
        role: ctx.role,
    };
}
