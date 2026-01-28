import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

// This would be protected by admin auth
export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const articlesSnap = await adminDb.collection("helpCenterArticles").get();
    const articles = articlesSnap.docs.map(doc => doc.data());
    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles for admin:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
