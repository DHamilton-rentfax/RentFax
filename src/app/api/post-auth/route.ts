import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";
import { resolvePersona } from "@/lib/auth/resolvePersona";
import { PERSONAS } from "@/types/persona";

export async function GET(request: Request) {
  const session = cookies().get("__session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let decoded;
  try {
    decoded = await adminAuth.verifySessionCookie(session, true);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const ctx = await getUserContext(decoded.uid);

  if (!ctx?.role) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const persona = resolvePersona(ctx.role);

  switch (persona) {
    case PERSONAS.SUPERADMIN:
      return NextResponse.redirect(new URL("/superadmin", request.url));

    case PERSONAS.STAFF:
      return NextResponse.redirect(new URL("/staff/admin", request.url));

    case PERSONAS.AGENCY:
      return NextResponse.redirect(new URL("/agency/dashboard", request.url));

    case PERSONAS.COMPANY:
      return NextResponse.redirect(new URL("/dashboard", request.url));

    case PERSONAS.RENTER:
      return NextResponse.redirect(new URL("/renter/dashboard", request.url));

    default:
      return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
}
