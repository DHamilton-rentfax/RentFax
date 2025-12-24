import { NextResponse } from "next/server";

// IMPORTANT:
// This assumes your server admin module exports an Admin Firestore instance.
// If your export name is different, change only this import line.
import { adminDb } from "@/firebase/server";

function nowMs() {
  return Date.now();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = String(url.searchParams.get("token") || "").trim();

    if (!token) {
      return NextResponse.json(
        { ok: false, status: "INVALID", message: "Missing token." },
        { status: 400 }
      );
    }

    const ref = adminDb.collection("selfVerifyRequests").doc(token);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { ok: false, status: "NOT_FOUND", message: "Verification request not found." },
        { status: 404 }
      );
    }

    const data = snap.data() || {};
    const status = String(data.status || "PENDING");

    const expiresAt = typeof data.expiresAt === "number" ? data.expiresAt : null;
    const expired = expiresAt ? nowMs() > expiresAt : false;

    // If expired but still pending, surface as EXPIRED
    const resolvedStatus =
      status === "PENDING" && expired ? "EXPIRED" : (status as any);

    return NextResponse.json({
      ok: true,
      status: resolvedStatus,
      request: {
        token,
        createdAt: typeof data.createdAt === "number" ? data.createdAt : null,
        expiresAt,
        renter: data.renter || {},
        requester: data.requester || {},
        context: data.context || {},
      },
    });
  } catch (e: any) {
    console.error("self-verify lookup error:", e);
    return NextResponse.json(
      { ok: false, status: "INVALID", message: "Server error." },
      { status: 500 }
    );
  }
}
