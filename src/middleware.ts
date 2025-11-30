import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value ?? null;

  const url = req.nextUrl.clone();

  const isDashboard = url.pathname.startsWith("/dashboard");
  const isAdmin = url.pathname.startsWith("/dashboard/admin");

  if (isDashboard && !session) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isAdmin) {
    const role = req.cookies.get("role")?.value;

    if (!role || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard/admin/:path*"],
};
