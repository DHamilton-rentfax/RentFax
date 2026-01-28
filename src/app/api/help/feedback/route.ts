import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";

// MOCK IMPLEMENTATION of rate limiting
const rateLimit = (ip: string) => {
    // In a real app, you would use a proper rate limiting service like Upstash Redis.
    console.log(`Rate limiting check for IP: ${ip}`);
    return true;
}

export async function POST(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const ip = req.ip ?? '127.0.0.1';

  // Basic rate limiting
  if(!rateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  const body = await req.json();
  const user = await getOptionalUser(req);

  // Data validation
  if (!body.articleSlug || !body.articleId || !body.rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const feedbackData = {
    articleSlug: body.articleSlug,
    articleId: body.articleId,
    rating: body.rating,
    reason: body.reason || null,
    comment: body.comment || null,
    userId: user?.id || null,
    role: user?.role || null,
    source: user ? "authenticated" : "public",
    createdAt: new Date(),
    ipAddress: ip, // Store IP for basic abuse detection
  };

  try {
    await adminDb.collection("help_article_feedback").add(feedbackData);

    // Trigger AI signal injection on negative feedback
    if (feedbackData.rating === 'not_helpful' && (feedbackData.reason === 'INCORRECT' || feedbackData.reason === 'CONFUSING')) {
        await adminDb.collection("ai_feedback_queue").add({
            source: "HELP_ARTICLE",
            articleSlug: feedbackData.articleSlug,
            issues: [feedbackData.reason],
            createdAt: new Date(),
        });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

}
