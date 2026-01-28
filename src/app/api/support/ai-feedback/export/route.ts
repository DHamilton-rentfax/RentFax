import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdminRole } from "@/lib/auth/roles";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  requireSuperAdminRole(req);

  const snap = await adminDb
    .collection("support_ai_feedback")
    .where("status", "in", ["new", "reviewed"])
    .orderBy("createdAt", "desc")
    .get();

  const dataset = snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return NextResponse.json({ dataset });
}
