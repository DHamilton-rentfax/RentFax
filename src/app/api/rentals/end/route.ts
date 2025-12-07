// ===========================================
// RentFAX | End-of-Rental Feedback API
// Location: src/app/api/rentals/end/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, addDoc, doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { renterId, propertyId, userId, scores, comments } = await req.json();

    if (!renterId || !userId)
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 });

    // Create new rental review
    const reviewRef = await addDoc(collection(db, "rentalReviews"), {
      renterRef: renterId,
      propertyRef: propertyId || null,
      submittedBy: userId,
      timelinessScore: scores.timeliness,
      cleanlinessScore: scores.cleanliness,
      communicationScore: scores.communication,
      damageReported: scores.damageReported,
      comments,
      createdAt: Timestamp.now(),
    });

    // Calculate average score
    const avgScore =
      (scores.timeliness + scores.cleanliness + scores.communication) / 3 -
      (scores.damageReported ? 1 : 0);

    // Update renter profile behavior score
    const renterRef = doc(db, "renterProfiles", renterId);
    const renterSnap = await getDoc(renterRef);
    const existing = renterSnap.data();

    const newBehaviorScore = existing?.behaviorScore
      ? Math.round((existing.behaviorScore + avgScore) / 2)
      : avgScore;

    await updateDoc(renterRef, {
      behaviorScore: newBehaviorScore,
      lastBehaviorUpdate: Timestamp.now(),
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
