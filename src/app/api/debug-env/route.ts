import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { firestore } from "@/lib/firebase/admin";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(idToken);

    const userDoc = await firestore.collection("users").doc(decoded.uid).get();
    const role = userDoc.data()?.role || "USER";
    const email = userDoc.data()?.email || decoded.email;

    if (role !== "SUPER_ADMIN" && email !== "info@rentfax.io") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    return NextResponse.json({
      firebaseAdmin: process.env.FIREBASE_ADMIN_PRIVATE_KEY
        ? "✅ Loaded"
        : "❌ Missing",
      stripeSecret: process.env.STRIPE_SECRET_KEY ? "✅ Loaded" : "❌ Missing",
      stripeWebhook: process.env.STRIPE_WEBHOOK_SECRET
        ? "✅ Loaded"
        : "❌ Missing",
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || "❌ Missing",
      aiKey:
        process.env.OPENAI_API_KEY || process.env.GOOGLE_API_KEY
          ? "✅ Present"
          : "⚠️ Missing AI key",
      env: process.env.NODE_ENV,
      region: process.env.VERCEL_REGION || "n/a",
      vercelUrl: process.env.VERCEL_URL || "n/a",
      time: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Debug env error:", error);
    return new NextResponse("Error verifying environment", { status: 500 });
  }
}
