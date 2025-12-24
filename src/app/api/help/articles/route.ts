import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

// Get all articles
export async function GET() {
    const snapshot = await adminDb.collection("help_articles").get();
    const articles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(articles);
}

// Create a new article
export async function POST(req: NextRequest) {
    const articleData = await req.json();
    
    // In a real app, you'd generate the embedding here before saving
    // For now, we assume it's passed in or handled by a separate function

    const newArticle = await adminDb.collection("help_articles").add(articleData);
    return NextResponse.json({ id: newArticle.id }, { status: 201 });
}
