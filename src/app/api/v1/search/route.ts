import { authenticateApiRequest } from "@/lib/api/auth";
import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { computeCrossIndustryRisk } from "@/lib/behavior/cross-industry-risk";
import { computeIdentityConfidence } from "@/lib/identity/confidence";

export async function POST(req: Request) {
  const auth = await authenticateApiRequest(req);
  if (!auth.ok) return NextResponse.json(auth, { status: 401 });

  const { query } = await req.json();

  if (!query) {
    return NextResponse.json({ error: "Search query is required." }, { status: 400 });
  }

  const results = await adminDb
    .collection("renters")
    .where("searchIndex", "array-contains", query.toLowerCase())
    .get();

  const renters = [];
  for (const doc of results.docs) {
    const data = doc.data();

    const risk = await computeCrossIndustryRisk(doc.id);
    const confidence = computeIdentityConfidence(data);

    renters.push({
      renterId: doc.id,
      name: data.name,
      identityConfidence: confidence,
      crossIndustryRisk: risk,
      fraudCluster: data.fraudNeighborhood,
    });
  }

  return NextResponse.json({ results: renters });
}
