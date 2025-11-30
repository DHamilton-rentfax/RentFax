import { adminDb } from "@/firebase/server";

import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { renterId, searchId, evidence } = body;

    const app = getFirebaseAdminApp();
    

    // Create new report document
    const docRef = await adminDb.collection("reports").add({
      renterId,
      searchId,
      evidence: evidence || [],
      createdAt: Date.now(),
      status: "ACTIVE",
    });

    return NextResponse.json({ reportId: docRef.id });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
