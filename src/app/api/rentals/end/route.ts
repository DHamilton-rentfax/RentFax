// ===========================================
// RentFAX | End-of-Rental Feedback API
// Location: src/app/api/rentals/end/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const { renterId, propertyId, userId, scores, comments } = await req.json();

    if (!renterId || !userId)
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });

    // Create new rental review
    const reviewRef = await adminDb.collection("rentalReviews").add({
      renterRef: renterId,
      propertyRef: propertyId || null,
      submittedBy: userId,
      timelinessScore: scores.timeliness,
      cleanlinessScore: scores.cleanliness,
      communicationScore: scores.communication,
      damageReported: scores.damageReported,
      comments,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Calculate average score
    const avgScore =
      (scores.timeliness + scores.cleanliness + scores.communication) / 3 -
      (scores.damageReported ? 1 : 0);

    // Update renter profile behavior score
    const renterRef = adminDb.collection("renterProfiles").doc(renterId);
    const renterSnap = await renterRef.get();
    const existing = renterSnap.data();

    const newBehaviorScore = existing?.behaviorScore
      ? Math.round((existing.behaviorScore + avgScore) / 2)
      : avgScore;

    await renterRef.update({
      behaviorScore: newBehaviorScore,
      lastBehaviorUpdate: FieldValue.serverTimestamp(),
    });

    // Return summary
    return NextResponse.json({
      success: true,
      reviewId: reviewRef.id,
      renterId,
      newBehaviorScore,
    });
  } catch (err) {
    console.error("End rental error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
