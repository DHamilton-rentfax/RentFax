import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getUserRoleFromHeaders, requireSupportRole } from "@/lib/auth/roles";

export async function GET(req: NextRequest, { params }: { params: { articleSlug: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { articleSlug } = params;
  const role = getUserRoleFromHeaders(req.headers) || "UNKNOWN";

  const snap = await adminDb
    .collection("help_articles")
    .where("slug", "==", articleSlug)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  const doc = snap.docs[0];
  const article = { id: doc.id, ...doc.data() };

  if (article.status === "draft" && !["SUPER_ADMIN","SUPPORT_ADMIN","COMPANY_ADMIN"].includes(role)) {
     return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  // Increment views in article
  adminDb
    .collection("help_articles")
    .doc(doc.id)
    .update({ views: adminDb.FieldValue.increment(1) })
    .catch(() => {});

  // Log ARTICLE_VIEW metric
  adminDb
    .collection("support_metrics")
    .add({
      type: "ARTICLE_VIEW",
      articleId: doc.id,
      articleTitle: article.title,
      userRole: role,
      createdAt: new Date(),
    })
    .catch(() => {});

  return NextResponse.json({ article });
}

export async function PATCH(req: NextRequest, { params }: { params: { articleSlug: string } }) {
  const user = requireSupportRole(req);
  const body = await req.json();

  const snap = await adminDb
    .collection("help_articles")
    .where("slug", "==", params.articleSlug)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  const doc = snap.docs[0];

  await adminDb
    .collection("help_articles")
    .doc(doc.id)
    .update({
      ...body,
      updatedBy: user.uid,
      updatedAt: new Date(),
    });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest, { params }: { params: { articleSlug: string } }) {
  requireSupportRole(req);

  const snap = await adminDb
    .collection("help_articles")
    .where("slug", "==", params.articleSlug)
    .limit(1)
    .get();

  if (snap.empty) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }
  const doc = snap.docs[0];

  await adminDb.collection("help_articles").doc(doc.id).delete();

  return NextResponse.json({ success: true });
}
