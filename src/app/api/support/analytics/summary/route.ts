import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { requireSupportRole } from "@/lib/auth/roles";
import { Timestamp } from "firebase-admin/firestore";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  // Only SUPER_ADMIN / SUPPORT_ADMIN
  requireSupportRole(req);

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const metricsSnap = await adminDb
    .collection("support_metrics")
    .where("createdAt", ">", Timestamp.fromDate(sevenDaysAgo))
    .get();

  const metrics = metricsSnap.docs.map((d) => d.data() as any);

  // Aggregate
  let articleViews: Record<string, { articleTitle: string; views: number }> = {};
  let categoryViews: Record<string, { categoryName: string; views: number }> = {};
  let searchCount = 0;
  let failedSearchCount = 0;
  let helpfulYes = 0;
  let helpfulNo = 0;

  metrics.forEach((m) => {
    switch (m.type) {
      case "ARTICLE_VIEW":
        if (!articleViews[m.articleId]) {
          articleViews[m.articleId] = {
            articleTitle: m.articleTitle || "Unknown",
            views: 0,
          };
        }
        articleViews[m.articleId].views += 1;
        break;

      case "CATEGORY_VIEW":
        if (!categoryViews[m.categoryId]) {
          categoryViews[m.categoryId] = {
            categoryName: m.categoryName || "Unknown",
            views: 0,
          };
        }
        categoryViews[m.categoryId].views += 1;
        break;

      case "SEARCH":
        searchCount += 1;
        break;

      case "SEARCH_NO_RESULTS":
        searchCount += 1;
        failedSearchCount += 1;
        break;

      case "HELPFUL_VOTE":
        if (m.vote === "yes") helpfulYes += 1;
        if (m.vote === "no") helpfulNo += 1;
        break;
    }
  });

  const topArticles = Object.entries(articleViews)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const topCategories = Object.entries(categoryViews)
    .map(([id, v]) => ({ id, ...v }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const failedSearchRate = searchCount
    ? Math.round((failedSearchCount / searchCount) * 100)
    : 0;

  return NextResponse.json({
    topArticles,
    topCategories,
    searchCount,
    failedSearchCount,
    failedSearchRate,
    helpfulYes,
    helpfulNo,
  });
}
