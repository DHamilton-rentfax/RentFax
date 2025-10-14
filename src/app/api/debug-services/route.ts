import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import admin, { firestore } from "@/lib/firebase/admin";
import Stripe from "stripe";
import { getStorage } from "firebase-admin/storage";

/**
 * Full System Diagnostics Endpoint
 * - Checks Firestore, Storage, Stripe, and AI key connectivity
 * - Restricted to SUPER_ADMIN
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await getAuth().verifyIdToken(token);
    const userDoc = await firestore.collection("users").doc(decoded.uid).get();
    const role = userDoc.data()?.role || "USER";
    const email = userDoc.data()?.email || decoded.email;

    if (role !== "SUPER_ADMIN" && email !== "info@rentfax.io") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // --- Firestore ---
    await firestore.collection("diagnostics").limit(1).get();

    // --- Stripe ---
    const products = await stripe.products.list({ limit: 1 });

    // --- Firebase Storage ---
    const storage = getStorage().bucket();
    const [files] = await storage.getFiles({ maxResults: 1 });
    const storageStatus = files ? "✅ Storage accessible" : "❌ Storage failed";

    // --- AI Service Test ---
    let aiStatus = "❌ Missing AI key";
    if (process.env.OPENAI_API_KEY || process.env.GOOGLE_API_KEY) {
      try {
        const aiKey =
          process.env.OPENAI_API_KEY || process.env.GOOGLE_API_KEY || "";
        // Use a lightweight, common API endpoint for the check
        const res = await fetch("https://api.openai.com/v1/models", {
          headers: {
            Authorization: `Bearer ${aiKey}`,
          },
        });
        aiStatus = res.ok ? "✅ AI key working" : "❌ AI service failed";
      } catch {
        aiStatus = "❌ AI check failed";
      }
    }

    // --- Email Check (Optional) ---
    const emailStatus = process.env.SMTP_USER
      ? "✅ SMTP configured"
      : "⚠️ No SMTP_USER set";

    return NextResponse.json({
      firestore: "✅ Firestore connected",
      stripe: products.data ? "✅ Stripe API reachable" : "❌ Stripe failed",
      storage: storageStatus,
      ai: aiStatus,
      email: emailStatus,
    });
  } catch (error: any) {
    console.error("❌ Service diagnostics error:", error);
    // Return a more specific error message if possible
    const errorMessage = error.message || "An unknown error occurred.";
    return NextResponse.json(
      {
        firestore: "❌ Firestore failed",
        stripe: "❌ Stripe failed",
        storage: "❌ Storage failed",
        ai: "❌ AI check failed",
        email: "❌ Email check failed",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
