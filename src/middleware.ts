// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // ✅ DEV BYPASS — cloud workstations & local dev cannot persist session cookies
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  const protectedPrefixes = [
    "/superadmin",
    "/support",
    "/dashboard",
    "/renter",
  ];

  const isProtected = protectedPrefixes.some((p) =>
    pathname.startsWith(p)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = req.cookies.get("__session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ⚠️ DO NOT VERIFY HERE — Edge runtime
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/superadmin/:path*",
    "/support/:path*",
    "/dashboard/:path*",
    "/renter/:path*",
  ],
};
