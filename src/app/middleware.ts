
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/firebase/server";

export async function middleware(request: NextRequest) {
  const idToken = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!idToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const role = decodedToken.role as string;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/api/admin") && role !== "SUPER_ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Add more role-based API route checks here as needed

    return NextResponse.next();
  } catch (error) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
}

export const config = {
  matcher: "/api/:path*",
};
