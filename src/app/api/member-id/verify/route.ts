import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { verifyApprovalToken } from "@/lib/memberId/generateApprovalToken";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("id");
  const token = searchParams.get("token");

  if (!requestId || !token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  if (!verifyApprovalToken(requestId, token)) {
    return NextResponse.json({ valid: false }, { status: 403 });
  }

  const snap = await adminDb
    .collection("memberIdRequests")
    .doc(requestId)
    .get();

  if (!snap.exists) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  const data = snap.data()!;

  if (
    data.status !== "PENDING" ||
    data.expiresAt.toMillis() < Date.now()
  ) {
    return NextResponse.json({ valid: false }, { status: 410 }); // 410 Gone
  }

  return NextResponse.json({
    valid: true,
    orgName: data.orgName,
  });
}
