import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { slug } = params;
    const articleRef = adminDb.collection("helpCenterArticles").doc(slug);
    const articleSnap = await articleRef.get();

    if (!articleSnap.exists) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Increment views
    await articleRef.update({
      views: FieldValue.increment(1),
    });

    return NextResponse.json(articleSnap.data());
  } catch (error) {
    console.error(`Error fetching article:`, error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
