import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const role = await getUserRoleFromHeaders(req.headers);
  if (role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const url = new URL(req.url);
  let query: FirebaseFirestore.Query = adminDb
    .collection("audit_logs")
    .orderBy("timestamp", "desc");

  const filters = [
    ["eventType", "==", url.searchParams.get("eventType")],
    ["actorRole", "==", url.searchParams.get("actorRole")],
    ["severity", "==", url.searchParams.get("severity")],
    ["targetCollection", "==", url.searchParams.get("targetCollection")],
    ["actorId", "==", url.searchParams.get("actorId")],
    ["targetId", "==", url.searchParams.get("targetId")],
  ];

  for (const [field, op, value] of filters) {
    if (value) query = query.where(field as any, op as any, value);
  }

  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  if (startDate) {
    query = query.where("timestamp", ">=", new Date(startDate));
  }
  if (endDate) {
    query = query.where("timestamp", "<=", new Date(endDate));
  }

  const limit = parseInt(url.searchParams.get("limit") || "100", 10);
  const snap = await query.limit(limit).get();

  const logs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return NextResponse.json({ logs });
}
