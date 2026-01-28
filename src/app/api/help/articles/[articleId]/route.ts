import { getAdminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

// Get a single article
export async function GET(req: NextRequest, { params }: { params: { articleId: string } }) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

    const doc = await adminDb.collection("help_articles").doc(params.articleId).get();
    if (!doc.exists) {
        return new NextResponse("Article not found", { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
}

// Update an article
export async function PUT(req: NextRequest, { params }: { params: { articleId: string } }) {
    const articleData = await req.json();
    await adminDb.collection("help_articles").doc(params.articleId).update(articleData);
    return NextResponse.json({ message: "Article updated" });
}

// Delete an article
export async function DELETE(req: NextRequest, { params }: { params: { articleId: string } }) {
    await adminDb.collection("help_articles").doc(params.articleId).delete();
    return NextResponse.json({ message: "Article deleted" });
}
