import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { calculateCompanyReputation } from "@/lib/company/calc-reputation";
import { CompanyReputationInputs } from "@/lib/company/reputation-types";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  const { companyId } = await req.json();

  const inputsSnap = await adminDb
    .collection("companyReputationInputs")
    .doc(companyId)
    .get();

  if (!inputsSnap.exists)
    return NextResponse.json({ error: "No reputation data." }, { status: 404 });

  const inputs = inputsSnap.data() as CompanyReputationInputs;

  const score = calculateCompanyReputation(inputs);

  // Save — but keep hidden
  await adminDb.collection("companyReputationScores")
    .doc(companyId)
    .set(
      {
        score,
        updatedAt: new Date().toISOString(),
        visibleToPublic: false, // locked
      },
      { merge: true }
    );

  return NextResponse.json({
    success: true,
    score,
    message: "Score recalculated (hidden mode).",
  });
}
