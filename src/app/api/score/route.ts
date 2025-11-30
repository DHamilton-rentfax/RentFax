import { adminDb } from "@/firebase/server";
import { NextRequest, NextResponse } from "next/server";

// A (very) simplified scoring engine for demonstration purposes

async function fetchExternalData(payload: any) {
  // In a real-world scenario, this would involve multiple API calls
  // to various data providers (credit bureaus, public records, etc.)
  console.log("Fetching external data for:", payload.fullName);
  // Simulate network delay
  await new Promise(res => setTimeout(res, 1500));

  // Simulate finding some public records
  const publicRecords = {
    hasEvictions: Math.random() > 0.8,
    hasCriminalRecord: Math.random() > 0.9,
  };

  return publicRecords;
}

function calculateScores(payload: any, externalData: any) {
  let identityScore = 50;
  let fraudScore = 20;

  if (payload.email) identityScore += 10;
  if (payload.phone) identityScore += 10;
  if (payload.address) identityScore += 10;
  if (payload.licenseNumber) identityScore += 20;

  if (externalData.hasEvictions) fraudScore += 40;
  if (externalData.hasCriminalRecord) fraudScore += 30;

  // Simulate some other fraud checks
  if (payload.email && payload.email.includes('yopmail')) {
    fraudScore += 15;
  }

  return {
    identityScore: Math.min(100, identityScore),
    fraudScore: Math.min(100, fraudScore),
  };
}

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    // 1. Fetch external data
    const externalData = await fetchExternalData(payload);

    // 2. Calculate scores
    const scores = calculateScores(payload, externalData);

    // 3. Check for existing reports in our database
    const reportsQuery = adminDb.collection("reports").where('email', '==', payload.email).limit(1);
    const reportsSnapshot = await reportsQuery.get();
    const preMatchedReportId = reportsSnapshot.docs.length > 0 ? reportsSnapshot.docs[0].id : null;

    const searchSession = {
      ...payload,
      ...scores,
      externalData,
      preMatchedReportId,
      createdAt: Date.now(),
    };

    // 4. Save the search session
    const searchRef = await adminDb.collection("searchSessions").add(searchSession);

    return NextResponse.json({ ...searchSession, id: searchRef.id });

  } catch (error: any) {
    console.error("Scoring engine error:", error);
    return NextResponse.json({ error: "Internal scoring error." }, { status: 500 });
  }
}
