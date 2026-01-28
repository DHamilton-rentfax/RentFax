import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";

const PARTNER_API_KEY = process.env.PARTNER_API_KEY;

// A simple auth check for demonstration purposes
function isAuthorized(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === PARTNER_API_KEY;
}

async function reanalyzeRenterRisk(renterId: string, requestUrl: string) {
  const riskEngineUrl = new URL("/api/ai/risk-engine", requestUrl).toString();

  try {
    const response = await fetch(riskEngineUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ renterId }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Failed to trigger risk re-analysis:", errorBody);
      // Even if re-analysis fails, we don't want to block the partner feedback
      // So we just log the error and continue.
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling risk engine API:", error);
    return null;
  }
}

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { renterId, outcome, details, partnerId } = await req.json();

    if (!renterId || !outcome || !partnerId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: renterId, outcome, and partnerId are required.",
        },
        { status: 400 },
      );
    }

    // 1. Store the feedback in Firestore
    const feedbackRef = await adminDb.collection("partner_feedback").add({
      renterId,
      partnerId,
      outcome, // e.g., 'confirmed_fraud', 'eviction', 'payment_default'
      details: details || "",
      createdAt: new Date().toISOString(),
      source: "PartnerAPI",
    });

    // 2. Trigger the AI Risk Engine to re-analyze the renter
    // We pass the original request URL to construct the absolute URL for the fetch call
    await reanalyzeRenterRisk(renterId, req.url);

    return NextResponse.json({
      success: true,
      message: "Feedback received and renter risk profile is being updated.",
      feedbackId: feedbackRef.id,
    });
  } catch (err: any) {
    console.error("Error in partner feedback endpoint:", err);
    return NextResponse.json(
      { error: "Failed to process partner feedback.", details: err.message },
      { status: 500 },
    );
  }
}
