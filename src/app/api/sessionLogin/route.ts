import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/server";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
    }

    await adminAuth.verifyIdToken(idToken);

    const expiresInMs = 1000 * 60 * 60 * 24 * 5;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: expiresInMs,
    });

    cookies().set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: expiresInMs / 1000,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("SESSION LOGIN FAILED", err);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
