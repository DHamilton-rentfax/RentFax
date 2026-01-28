import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/firebase/server";

export const dynamic = "force-dynamic"; // 👈 ADD THIS

export async function GET() {
  const session = cookies().get("__session")?.value;
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const adminAuth = getAdminAuth();
  if (!adminAuth) {
    return NextResponse.json({ user: null });
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    return NextResponse.json({
      user: {
        uid: decoded.uid,
        role: decoded.role ?? null,
        companyId: decoded.companyId ?? null,
      },
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
