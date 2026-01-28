import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";
import { upsertBacklogFromSignal } from "@/lib/support/backlog";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const role = getUserRoleFromHeaders(req.headers) || "UNKNOWN";

  if (!q) return NextResponse.json({ results: [] });

  const snap = await adminDb
    .collection("help_articles")
    .where("status", "==", "published")
    .get();

  // naive text filter (can be improved later)
  const results = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((a: any) =>
      (a.title || "").toLowerCase().includes(q.toLowerCase()) ||
      (a.content || "").toLowerCase().includes(q.toLowerCase())
    )
    .slice(0, 20);

  const hasResults = results.length > 0;

  await adminDb.collection("support_metrics").add({
    type: hasResults ? "SEARCH" : "SEARCH_NO_RESULTS",
    query: q,
    hasResults,
    userRole: role,
    createdAt: new Date(),
  });

  if (!hasResults) {
    await upsertBacklogFromSignal({
        sourceType: "SEARCH",
        query: q,
        context: "support_search",
        role,
    });
  }

  return NextResponse.json({ results });
}
