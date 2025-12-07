// ===========================================
// RentFAX | Super-Admin Analytics API
// Location: src/app/api/admin/analytics/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { db } from "@/firebase/server";
import { collection, getDocs } from "firebase/firestore";

// In a real application, this route should be protected by a robust authentication
// and authorization check to ensure only super-admins can access it.
async function verifyAdmin(req: Request) {
    // For now, we'll use a simple placeholder secret check.
    // In production, this would involve checking a JWT, a session, or user roles in Firestore.
    const isAdmin = req.headers.get("Authorization") === `Bearer SUPER_SECRET_ADMIN_KEY`;
    return isAdmin;
}

export async function GET(req: Request) {
    // 1. Security Check
    const isAdmin = await verifyAdmin(req);
    if (!isAdmin) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    try {
        // 2. Aggregate Metrics
        const usersSnap = await getDocs(collection(db, "users"));
        const rentersSnap = await getDocs(collection(db, "renterProfiles"));
        const reviewsSnap = await getDocs(collection(db, "rentalReviews"));

        const totalUsers = usersSnap.size;
        const totalRenterProfiles = rentersSnap.size;
        const totalReviews = reviewsSnap.size;

        let totalScore = 0;
        let rentersWithScores = 0;

        rentersSnap.forEach(doc => {
            const data = doc.data();
            if (data.behaviorScore && typeof data.behaviorScore === 'number') {
                totalScore += data.behaviorScore;
                rentersWithScores++;
            }
        });

        const averageBehaviorScore = rentersWithScores > 0 ? parseFloat((totalScore / rentersWithScores).toFixed(2)) : 0;

        // 3. Return a consolidated analytics object
        return NextResponse.json({
            success: true,
            analytics: {
                totalUsers,
                totalRenterProfiles,
                totalReviews,
                averageBehaviorScore,
                lastUpdated: new Date().toISOString(),
            },
        });

    } catch (err: any) {
        console.error("Admin Analytics Error:", err);
        return NextResponse.json({ success: false, error: "Server error while aggregating analytics." }, { status: 500 });
    }
}
