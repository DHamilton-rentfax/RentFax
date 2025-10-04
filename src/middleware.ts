
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const role = req.cookies.get("role")?.value; // set during login

  // The middleware should only run for app-related routes, not public marketing pages.
  const isAppRoute = url.pathname.startsWith('/admin') || url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/editor') || url.pathname.startsWith('/support') || url.pathname.startsWith('/viewer');

  if (!isAppRoute) {
    return NextResponse.next();
  }

  // If on an app route, check for role.
  if (!role) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based redirects and protections
  if (url.pathname.startsWith("/admin")) {
    if (url.pathname.startsWith("/admin/super-dashboard") && role !== "SUPER_ADMIN") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/admin/dashboard") && !["ADMIN","SUPER_ADMIN"].includes(role)) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith("/editor") && !["EDITOR","ADMIN","SUPER_ADMIN"].includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/support") && !["SUPPORT","ADMIN","SUPER_ADMIN"].includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/viewer") && !["VIEWER","ADMIN","SUPER_ADMIN"].includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
