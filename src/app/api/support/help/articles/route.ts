import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const articlesSnap = await adminDb.collection("helpCenterArticles").where("status", "==", "published").get();
    const articles = articlesSnap.docs.map(doc => doc.data());

    const categories = articles.reduce((acc, article) => {
      const category = article.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = { name: category, count: 0 };
      }
      acc[category].count++;
      return acc;
    }, {} as Record<string, { name: string, count: number }>);

    const trending = articles
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    return NextResponse.json({
      categories: Object.values(categories),
      trending,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}
