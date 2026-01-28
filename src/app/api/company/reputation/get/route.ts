import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const url = new URL(req.url);
    const companyId = url.searchParams.get("companyId");

    if (!companyId) return NextResponse.json({ error: "Missing company ID" }, { status: 400 });

    const doc = await adminDb
      .collection("companyReputationScores")
      .doc(companyId)
      .get();

    if (!doc.exists) return NextResponse.json({ score: null });

    const data = doc.data();

    // Super admin can see the score, otherwise respect the visibility lock
    const isSuperAdmin = req.headers.get("X-Super-Admin") === "true";
    if (isSuperAdmin) {
        return NextResponse.json({ score: data.score });
    }

    return NextResponse.json({
      score: data.visibleToPublic ? data.score : null, // HIDDEN
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to get score" }, { status: 500 });
  }
}
