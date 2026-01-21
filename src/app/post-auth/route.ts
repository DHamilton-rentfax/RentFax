import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { ROLES } from "@/types/roles";

export const dynamic = "force-dynamic";

function redirectTo(path: string, req: NextRequest) {
  return NextResponse.redirect(new URL(path, req.url));
}

export async function GET(req: NextRequest) {
  const session = cookies().get("__session")?.value;
  if (!session) return redirectTo("/login", req);

  let decoded: { uid: string };
  try {
    decoded = await adminAuth.verifySessionCookie(session, true);
  } catch {
    // Invalid/expired cookie -> go login
    return redirectTo("/login", req);
  }

  const ctx = await getUserContext(decoded.uid);

  // ✅ Single source of truth for routing aligned with src/types/roles.ts
  switch (ctx.role) {
    case ROLES.SUPER_ADMIN:
      return redirectTo("/superadmin", req);

    case ROLES.SUPPORT_ADMIN:
    case ROLES.SUPPORT_AGENT:
    case ROLES.SUPPORT_STAFF:
    case ROLES.COMPLIANCE_AGENT:
    case ROLES.CONTENT_MODERATOR:
      return redirectTo("/support", req);

    case ROLES.FRAUD_TEAM:
    case ROLES.LISTINGS_TEAM:
    case ROLES.ONBOARDING_TEAM:
      return redirectTo("/staff/admin", req);

    case ROLES.SALES_AGENT:
      return redirectTo("/agency/dashboard", req);

    case ROLES.RENTER:
      return redirectTo("/renter/dashboard", req);

    case ROLES.ORG_OWNER:
    case ROLES.ORG_STAFF:
    case ROLES.COMPANY_ADMIN:
    case ROLES.LANDLORD:
    case ROLES.USER:
      return redirectTo("/dashboard", req);

    case ROLES.UNINITIALIZED:
    default:
      // Safety net for uninitialized or unknown roles
      return redirectTo("/unauthorized", req);
  }
}
