import { NextResponse } from "next/server";
import { adminAuth, adminDb, adminStorage } from "@/firebase/server";
import { cookies } from "next/headers";
import { logAudit } from "@/lib/audit";
import { ROLES } from "@/types/roles";

export async function POST(req: Request) {
  try {
    // --- Auth ---
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("__session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
    }

    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const role = (decoded as any).role;
    const companyId = (decoded as any).companyId ?? null;

    // --- Input ---
    const { evidenceId } = await req.json();
    if (!evidenceId) {
      return NextResponse.json({ error: "MISSING_EVIDENCE_ID" }, { status: 400 });
    }

    // --- Authorization (DB is source of truth) ---
    const evidenceSnap = await adminDb
      .collection("evidence")
      .doc(evidenceId)
      .get();

    if (!evidenceSnap.exists) {
      return NextResponse.json({ error: "EVIDENCE_NOT_FOUND" }, { status: 404 });
    }

    const evidence = evidenceSnap.data()!;

    const isOwner =
      decoded.uid === evidence.renterId ||
      (companyId && companyId === evidence.companyId);

    const isAdmin =
      role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    // --- Generate Signed URL ---
    const bucket = adminStorage.bucket();
    const file = bucket.file(evidence.filePath);

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 10, // 10 minutes
    });

    // --- Audit ---
    await logAudit({
      action: "VIEW_EVIDENCE",
      actorId: decoded.uid,
      actorRole: role,
      targetType: "EVIDENCE",
      targetId: evidenceId,
      metadata: {
        filePath: evidence.filePath,
      },
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Signed URL error:", err);
    return NextResponse.json(
      { error: "SIGNED_URL_FAILED" },
      { status: 500 }
    );
  }
}
