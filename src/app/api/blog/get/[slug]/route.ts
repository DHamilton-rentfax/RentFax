
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(
  _: Request,
  { params }: { params: { slug: string } }
) {
  const snap = await adminDb
    .collection("blogPosts")
    .where("slug", "==", params.slug)
    .limit(1)
    .get();

  if (snap.empty) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(snap.docs[0].data());
}
