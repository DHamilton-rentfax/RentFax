import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  requireSupportRole(req);

  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // optional

  let query = adminDb
    .collection("support_content_backlog")
    .orderBy("totalCount", "desc")
    .limit(200);

  if (status) {
    query = query.where("status", "==", status);
  }

  const snap = await query.get();
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return NextResponse.json({ items });
}
