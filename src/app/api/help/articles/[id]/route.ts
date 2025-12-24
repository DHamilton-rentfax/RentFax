import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

// Get a single article
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const doc = await adminDb.collection("help_articles").doc(params.id).get();
    if (!doc.exists) {
        return new NextResponse("Article not found", { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
}

// Update an article
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const articleData = await req.json();
    await adminDb.collection("help_articles").doc(params.id).update(articleData);
    return NextResponse.json({ message: "Article updated" });
}

// Delete an article
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    await adminDb.collection("help_articles").doc(params.id).delete();
    return NextResponse.json({ message: "Article deleted" });
}
