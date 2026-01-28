import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { FieldValue } from "firebase-admin/firestore";

// GET - list disputes depending on role
export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  // const user = await getAuthUser();
  // if (!user)
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const disputesRef = adminDb.collection("disputes");

  const q = disputesRef;

  const snapshot = await q.get();
  const disputes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return NextResponse.json({ disputes });
}

// POST - create a new dispute
export async function POST(request: Request) {
  // const user = await getAuthUser();
  // if (!user)
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const { renterId, reportId, description, evidenceUrls = [] } = data;

  if (!renterId || !reportId || !description)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const docRef = await adminDb.collection("disputes").add({
    renterId,
    reportId,
    description,
    evidenceUrls,
    status: "pending",
    // createdBy: user.uid,
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ id: docRef.id, success: true });
}
