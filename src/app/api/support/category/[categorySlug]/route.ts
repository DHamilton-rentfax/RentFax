import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getUserRoleFromHeaders } from "@/lib/auth/roles";

export async function GET(
  req: NextRequest,
  { params }: { params: { categorySlug: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { categorySlug } = params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const offset = (page - 1) * limit;

  const role = getUserRoleFromHeaders(req.headers);

  // 1. Fetch Category Details from a 'help_categories' collection
  const categorySnap = await adminDb
    .collection("help_categories")
    .where("slug", "==", categorySlug)
    .limit(1)
    .get();

  if (categorySnap.empty) {
    return NextResponse.json({ error: "CATEGORY_NOT_FOUND" }, { status: 404 });
  }
  const category = categorySnap.docs[0].data();
  const categoryId = categorySnap.docs[0].id; 

  // 2. Build Query for Articles
  let articlesBaseQuery = adminDb
    .collection("help_articles")
    .where("categoryId", "==", categoryId);

  // 3. Apply role-based filtering
  if (!["SUPER_ADMIN", "SUPPORT_ADMIN", "COMPANY_ADMIN"].includes(role)) {
    articlesBaseQuery = articlesBaseQuery.where("status", "==", "published");
  }

  // 4. Get total count for pagination
  const totalSnap = await articlesBaseQuery.get();
  const total = totalSnap.size;

  // 5. Get paginated articles
  const articlesSnap = await articlesBaseQuery.orderBy("createdAt", "desc").offset(offset).limit(limit).get();

  const articles = articlesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // 6. Analytics (no-await)
  adminDb.collection("analytics").doc("category_impressions").collection("impressions").add({
    slug: categorySlug,
    role: role,
    timestamp: new Date(),
  });

  return NextResponse.json({
    category,
    articles,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
