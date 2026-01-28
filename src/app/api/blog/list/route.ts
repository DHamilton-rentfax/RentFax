import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const snap = await adminDb
    .collection("blogPosts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .get();

  const posts = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ posts });
}
