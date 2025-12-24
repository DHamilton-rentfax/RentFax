import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";

export async function GET(req: NextRequest) {
  const role = await getUserRoleFromHeaders(req.headers);
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const snap = await adminDb
    .collection("audit_logs")
    .orderBy("timestamp", "desc")
    .limit(200)
    .get();

  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ logs });
}
