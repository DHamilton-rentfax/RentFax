import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/firebase/server";
import { getUserContext } from "@/app/actions/get-user-context";

export async function GET() {
  try {
    const session = cookies().get("__session")?.value;
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(session, true);
    const ctx = await getUserContext(decoded.uid);

    if (!ctx) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        uid: decoded.uid,
        role: ctx.role,
        orgId: ctx.orgId ?? null,
      },
    });
  } catch (err) {
    console.error("Auth context error:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
