
import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const snapshot = await adminDb
      .collection("renters")
      .where("crossIndustryRiskScore", ">", 0)
      .orderBy("crossIndustryRiskScore", "desc")
      .limit(50)
      .get();

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().fullName || "Unknown Renter",
      crossIndustryRiskScore: doc.data().crossIndustryRiskScore,
      crossIndustryTier: doc.data().crossIndustryTier,
    }));

    return NextResponse.json({ list });
  } catch (error) {
    console.error("Error fetching cross-industry risk list:", error);
    return NextResponse.json(
      { error: "Failed to fetch data." },
      { status: 500 }
    );
  }
}
