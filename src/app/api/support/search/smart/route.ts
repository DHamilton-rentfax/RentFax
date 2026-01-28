import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { query } = await req.json();
  const role = getUserRoleFromHeaders(req.headers) || "UNKNOWN";

  const normalized = query.toLowerCase();

  const indexSnap = await adminDb
    .collection("support_search_index")
    .get();

  const items = indexSnap.docs.map((d) => d.data());

  const ranked = items
    .map((item: any) => {
      // Role filtering
      if (item.audience !== "all" && item.audience !== role) return null;

      // Basic scoring
      let score = 0;
      if (item.title.toLowerCase().includes(normalized)) score += 5;
      if (item.keywords?.some((k: string) => normalized.includes(k))) score += 2;

      return score > 0 ? { ...item, score } : null;
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 10);

  return NextResponse.json({ results: ranked });
}
