import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

// GET - retrieve reports
export async function GET() {
  // const user = await getAuthUser();
  // if (!user)
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reportsRef = adminDb.collection("reports");

  const q = reportsRef;

  const snapshot = await q.get();
  const reports = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ reports });
}

// POST - create a report
export async function POST(request: Request) {
  // const user = await getAuthUser();
  // if (!user)
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const { renterId, reportDetails, fraudScore, country } = data;

  if (!renterId || !reportDetails)
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );

  const docRef = await adminDb.collection("reports").add({
    renterId,
    reportDetails,
    fraudScore: fraudScore ?? null,
    country: country ?? "US",
    // createdBy: user.uid,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id: docRef.id, success: true });
}
