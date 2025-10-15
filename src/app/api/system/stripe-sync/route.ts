import { NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";

// ----------------------
// 1️⃣ Initialize Firebase Admin
// ----------------------
if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64
    ? Buffer.from(process.env.FIREBASE_ADMIN_PRIVATE_KEY_BASE64, "base64").toString()
    : process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = admin.firestore();

// ----------------------
// 2️⃣ Initialize Stripe
// ----------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ----------------------
// 3️⃣ Plan Sync Logic
// ----------------------
export async function POST() {
  try {
    console.log("🔁 Starting Stripe plan sync job (App Hosting route)...");

    const usersSnap = await db.collection("users").get();
    let updatedCount = 0;

    for (const doc of usersSnap.docs) {
      const user = doc.data();
      if (!user.stripeCustomerId) continue;

      try {
        const subs = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          status: "all",
          limit: 1,
        });

        const subscription = subs.data[0];
        const planName =
          subscription?.status === "active"
            ? subscription.items.data[0]?.price.lookup_key?.replace("price_", "") || "pro"
            : "free";

        if (user.plan !== planName) {
          await doc.ref.update({
            plan: planName,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          await db.collection("auditLogs").add({
            type: "PLAN_SYNC",
            userId: doc.id,
            email: user.email,
            oldPlan: user.plan,
            newPlan: planName,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            triggeredBy: "system",
          });

          console.log(`📝 ${user.email}: ${user.plan} → ${planName}`);
          updatedCount++;
        }
      } catch (error: any) {
        console.error(`❌ Error syncing ${user.email}:`, error.message);
      }
    }

    console.log(`✅ Stripe plan sync completed. Updated ${updatedCount} users.`);
    return NextResponse.json({
      success: true,
      updated: updatedCount,
      message: "Stripe plan sync completed successfully",
    });
  } catch (error: any) {
    console.error("❌ Stripe plan sync failed:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
