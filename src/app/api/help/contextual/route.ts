import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { getOptionalUser } from "@/lib/auth/optionalUser";

export async function GET(req: NextRequest) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const url = new URL(req.url);
  const locationKey = url.searchParams.get("locationKey");

  if (!locationKey) {
    return NextResponse.json({ items: [] });
  }

  const user = await getOptionalUser(req);

  try {
    const snap = await adminDb
      .collection("contextual_help")
      .where("locationKey", "==", locationKey)
      .orderBy("priority", "asc")
      .get();

    const allItems = snap.docs.map(d => d.data());

    // Role-based filtering
    const items = allItems.filter(h => {
      if (!h.roles || h.roles.length === 0) return true; // Public
      if (!user?.role) return false; // User has no role
      return h.roles.includes(user.role);
    });

    // In a real app, you would also filter by plan (h.plans)

    return NextResponse.json({ items });

  } catch (error) {
    console.error("Error fetching contextual help:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
