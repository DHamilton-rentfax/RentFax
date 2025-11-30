// src/app/api/auth/setSession/route.ts

import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const { idToken, role } = await req.json();

    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ ok: true });

    res.cookies.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    res.cookies.set("role", role ?? "USER", {
      maxAge: expiresIn / 1000,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return res;
  } catch (error) {
    console.error("Error setting session:", error);
    return NextResponse.json({ error: "Unable to set session" }, { status: 500 });
  }
}
