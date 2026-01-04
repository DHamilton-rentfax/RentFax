import { NextResponse } from "next/server";
import { adminAuth } from "@/firebase/server";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const sessionCookie = req.headers
      .get("cookie")
      ?.split("__session=")[1]
      ?.split(";")[0];

    if (!sessionCookie) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

    const body = await req.json();
    const { action, targetType, targetId, metadata } = body;

    await logAudit({
      action,
      actorId: decoded.uid,
      actorRole: (decoded as any).role ?? "UNKNOWN",
      targetType,
      targetId,
      metadata,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "AUDIT_LOG_FAILED" },
      { status: 500 }
    );
  }
}
