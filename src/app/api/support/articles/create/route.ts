import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";
import { requireSupportRole } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const user = requireSupportRole(req); // SUPER_ADMIN or SUPPORT_ADMIN only
  const body = await req.json();

  const { title, slug, content, categoryId, audience, tags, status } = body;

  const catSnap = await adminDb.collection("help_categories").doc(categoryId).get();
  if (!catSnap.exists) {
    return NextResponse.json({ error: "CATEGORY_NOT_FOUND" }, { status: 400 });
  }

  const data = {
    title,
    slug,
    content,
    categoryId,
    categoryName: catSnap.data()?.name,
    audience,
    tags: tags || [],
    status: status || "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: user.uid,
    updatedBy: user.uid,
    views: 0,
  };

  const docRef = await adminDb.collection("help_articles").add(data);

  return NextResponse.json({ id: docRef.id, ...data });
}
