import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const snap = await adminDb
    .collection("blogPosts")
    .where("slug", "==", slug)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ post: null });
  }

  const post = {
    id: snap.docs[0].id,
    ...snap.docs[0].data(),
  };

  return NextResponse.json({ post });
}
