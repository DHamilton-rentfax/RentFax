import { getAdminDb } from "@/firebase/server";
import { getUserIdFromHeaders, getUserRoleFromHeaders } from "@/lib/auth/roles";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const role = getUserRoleFromHeaders(req.headers);
  const uid = getUserIdFromHeaders(req.headers);

  if (!["SUPER_ADMIN", "SUPPORT_ADMIN"].includes(role)) {
    return NextResponse.json({ threads: [] }, { status: 403 });
  }

  const snap = await adminDb
    .collection("support_threads")
    .where("assignedTo", "==", uid)
    .where("status", "!=", "closed")
    .orderBy("status")
    .orderBy("updatedAt", "desc")
    .get();

  const threads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ threads });
}
