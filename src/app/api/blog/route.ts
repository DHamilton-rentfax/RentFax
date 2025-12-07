import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  const snap = await adminDb
    .collection("blogPosts")
    .orderBy("createdAt", "desc")
    .get();

  const posts = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ posts });
}
