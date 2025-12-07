import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";

export async function GET() {
  try {
    const snap = await adminDb
      .collection("identityRequests")
      .orderBy("createdAt", "desc")
      .limit(200)
      .get();

    const requests = snap.docs.map((doc) => {
      const d = doc.data() || {};
      return {
        id: doc.id,
        renterName: d.renterName ?? "",
        renterEmail: d.renterEmail ?? null,
        renterPhone: d.renterPhone ?? null,
        status: d.status ?? "PENDING",
        createdAt: d.createdAt ?? null,
        completedAt: d.completedAt ?? null,
      };
    });

    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error("Error loading identity requests:", err);
    return NextResponse.json(
      { error: "Failed to load identity requests" },
      { status: 500 }
    );
  }
}
