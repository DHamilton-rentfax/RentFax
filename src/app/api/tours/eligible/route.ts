import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";

// In a real implementation, you'd want to cache these tour lookups
async function getEligibleTours(page: string, role: string | null) {
    const toursRef = adminDb.collection("product_tours");
    const query = toursRef
        .where("isActive", "==", true)
        .where('trigger.type', '==', 'on_first_visit')
        .where('trigger.page', '==', page);
    
    const tourSnap = await query.get();
    if (tourSnap.empty) return [];

    const tours = tourSnap.docs.map(d => d.data());

    // Filter by role
    const roleFilteredTours = tours.filter(t => {
        if (!t.roles || t.roles.length === 0) return true; // Public tour
        if (!role) return false; // Role-restricted tour but user has no role
        return t.roles.includes(role);
    });

    return roleFilteredTours;
}

async function getUserProgress(userId: string, tourSlugs: string[]) {
    const progressMap = new Map();
    if (!userId || tourSlugs.length === 0) return progressMap;

    const progressRef = adminDb.collection("user_tour_progress");
    const userProgressQuery = progressRef.where('userId', '==', userId).where('tourSlug', 'in', tourSlugs);
    const progressSnap = await userProgressQuery.get();

    progressSnap.forEach(doc => {
        progressMap.set(doc.data().tourSlug, doc.data());
    });

    return progressMap;
}

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const url = new URL(req.url);
  const page = url.searchParams.get("page");
  if (!page) {
    return NextResponse.json({ error: "Page parameter is required" }, { status: 400 });
  }

  const user = await getOptionalUser(req);
  const allEligibleTours = await getEligibleTours(page, user?.role || null);

  if (allEligibleTours.length === 0) {
      return NextResponse.json({ tours: [] });
  }

  const progressMap = await getUserProgress(user?.id, allEligibleTours.map(t => t.slug));

  const toursToRun = allEligibleTours.filter(tour => {
      const progress = progressMap.get(tour.slug);
      // Run if user has no progress record for this tour (i.e., not started)
      return !progress || progress.status === 'not_started';
  });

  // Add the starting step from progress if it exists
  const toursWithProgress = toursToRun.map(tour => {
      const progress = progressMap.get(tour.slug);
      return {
          ...tour,
          startAtStep: progress?.currentStepIndex || 0,
      }
  })

  // For simplicity, we'll just return the first eligible tour.
  // A more complex app might have a priority system or allow multiple manual-trigger tours.
  const tour = toursWithProgress.length > 0 ? toursWithProgress[0] : null;

  return NextResponse.json({ tour });
}
