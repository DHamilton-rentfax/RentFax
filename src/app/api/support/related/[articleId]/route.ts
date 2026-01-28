import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

function extractKeywords(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(" ")
      .filter((w) => w.length > 3);
  }

export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { articleId } = params;

  const articleSnap = await adminDb.collection("help_articles").doc(articleId).get();
  if (!articleSnap.exists) return NextResponse.json({ related: [] });

  const article = articleSnap.data();
  if (!article) return NextResponse.json({ related: [] });

  const keywords = extractKeywords(article.title + " " + article.content);

  const indexSnap = await adminDb.collection("support_search_index").get();
  const index = indexSnap.docs.map((d) => d.data());

  const related = index
    .map((i: any) => {
      if (i.articleId === articleId) return null;

      if (!i.keywords) return null;
      const shared = i.keywords.filter((k: string) => keywords.includes(k)).length;
      if (shared === 0) return null;

      return {
        ...i,
        score: shared,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 5);

  return NextResponse.json({ related });
}
