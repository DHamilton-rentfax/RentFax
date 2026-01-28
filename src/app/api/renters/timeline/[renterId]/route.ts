import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import type { RenterTimelineEvent } from "@/types/timeline";

export async function GET(
  _req: Request,
  { params }: { params: { renterId: string } }
) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const snap = await adminDb
      .collection("renterTimeline")
      .where("renterId", "==", params.renterId)
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const events: RenterTimelineEvent[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    return NextResponse.json({ events });
  } catch (err) {
    console.error("Error fetching renter timeline", err);
    return NextResponse.json(
      { error: "Failed to load renter timeline" },
      { status: 500 }
    );
  }
}
