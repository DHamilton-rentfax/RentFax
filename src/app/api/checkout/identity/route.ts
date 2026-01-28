import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getPricingConfig } from "@/firebase/server/pricing";

// This should be your Stripe secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

// Define expected payload structure for type safety
interface CheckoutPayload {
  purchaser: {
    uid: string;
    companyId?: string | null;
    mode: "COMPANY" | "INDIVIDUAL";
  };
  renterPayload: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    license?: string | null;
  };
}

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const body = (await req.json()) as CheckoutPayload;
  const { purchaser, renterPayload } = body;

  // --- 1. VALIDATION ---
  if (!purchaser?.uid) {
    return new NextResponse("Unauthorized: Missing purchaser UID.", {
      status: 401,
    });
  }

  if (!renterPayload?.name) {
    return new NextResponse("Bad Request: Renter name is required.", {
      status: 400,
    });
  }

  try {
    const pricing = await getPricingConfig();
    const identityCheckPrice = Math.round(pricing.identityCheck * 100); // in cents

    // --- 2. CREATE THE REPORT IN FIRESTORE (CRITICAL STEP) ---
    const reportRef = await adminDb.collection("reports").add({
      // Purchaser Info
      purchaserUid: purchaser.uid,
      companyId: purchaser.companyId || null,
      purchaseMode: purchaser.mode,

      // Renter Info (as provided at time of search)
      renter: renterPayload,

      // Status
      unlocked: false,
      verificationMethod: "PENDING_PAYMENT",

      // Timestamps
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const newReportId = reportRef.id;

    // --- 3. CREATE STRIPE CHECKOUT SESSION ---
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "RentFAX Identity Verification",
              description: `Verification for ${renterPayload.name}`,
            },
            unit_amount: identityCheckPrice,
          },
          quantity: 1,
        },
      ],
      // --- 4. ATTACH THE CORRECT METADATA (THE KEY FIX) ---
      metadata: {
        reportId: newReportId,
        purchaserUid: purchaser.uid,
      },
      // --- 5. DEFINE REDIRECT URLS ---
      success_url: `${process.env.APP_URL}/report/${newReportId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/`,
    });

    // --- 6. RETURN THE CHECKOUT URL ---
    if (!session.url) {
      throw new Error("Stripe session creation failed: no URL returned.");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("🔥 API Error: /api/checkout/identity", {
      errorMessage: err.message,
      stack: err.stack,
    });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
