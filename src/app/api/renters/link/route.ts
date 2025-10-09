// src/app/api/renters/link/route.ts
import { adminDB as db } from "@/lib/firebase-admin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { renterId } = await req.json();
    if (!renterId) throw new Error("Missing renterId");

    const renterRef = db.collection("renters").doc(renterId);
    const renterSnap = await renterRef.get();
    if (!renterSnap.exists) throw new Error("Renter not found");

    const renter = renterSnap.data();
    if (!renter) throw new Error("Renter data is missing");
    
    const { fullName, dateOfBirth, govIdLast4 } = renter;

    // 🔍 Search for matching incidents
    const incidentQuery = await db.collection("incidents")
      .where("renterName", "==", fullName)
      .get();

    const matchedIncidents: string[] = [];
    for (const doc of incidentQuery.docs) {
      const data = doc.data();
      if (
        (data.renterDOB && data.renterDOB === dateOfBirth) ||
        (data.renterGovIdLast4 && data.renterGovIdLast4 === govIdLast4)
      ) {
        matchedIncidents.push(doc.id);
        await doc.ref.update({ renterId: renterId });
      }
    }

    // 🔍 Link resolutions
    const resolutionQuery = await db.collection("resolutions")
      .where("renterId", "==", null)
      .get();

    const matchedResolutions: string[] = [];
    for (const doc of resolutionQuery.docs) {
      const data = doc.data();
      if (matchedIncidents.includes(data.incidentId)) {
        matchedResolutions.push(doc.id);
        await doc.ref.update({ renterId });
      }
    }

    // 🔗 Update renter document
    await renterRef.update({
      linkedIncidents: matchedIncidents,
      linkedResolutions: matchedResolutions,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      matchedIncidents,
      matchedResolutions,
    });
  } catch (err: any) {
    console.error("Linking error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
