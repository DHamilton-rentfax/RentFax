
import { NextResponse } from "next/server";
import type { NextRequest } from "next/request";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const role = req.cookies.get("role")?.value; // set during login

  // If on an app route, check for role.
  if (!role) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role-based redirects and protections
  if (url.pathname.startsWith("/admin")) {
    if (url.pathname.startsWith("/admin/super-dashboard") && role !== "super_admin") {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/admin/dashboard") && !["admin","super_admin"].includes(role)) {
      url.pathname = "/unauthorized";
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname.startsWith("/editor") && !["editor","admin","super_admin"].includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/support") && !["support","admin","super_admin"].includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (url.pathname.startsWith("/viewer") && !["viewer","admin","super_admin"].includes(role)) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all app routes that require authentication.
     * Public pages like marketing, blog, pricing, etc. are excluded.
     */
    '/dashboard/:path*',
    '/admin/:path*',
    '/editor/:path*',
    '/support/:path*',
    '/viewer/:path*',
    '/settings/:path*',
    '/setup/:path*',
    '/renters/:path*',
    '/incidents/:path*',
    '/disputes/:path*',
  ],
}
