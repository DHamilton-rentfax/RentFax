
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    const decoded = await auth.verifyIdToken(idToken);

    const roleRaw = (decoded.role || "RENTER") as string;

    // Normalize
    const role = roleRaw.toLowerCase();

    // Create secure session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    cookies().set("session", sessionCookie, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: expiresIn,
    });

    return NextResponse.json({ role });
  } catch (err) {
    console.error("Session login error:", err);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
