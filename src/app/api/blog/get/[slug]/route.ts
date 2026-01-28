
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb
    .collection("blogPosts")
    .where("slug", "==", params.slug)
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(snap.docs[0].data());
}
