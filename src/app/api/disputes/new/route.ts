import { adminDB as dbAdmin } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      renterId,
      incidentId,
      renterStatement,
      evidenceUrls = [],
    } = await req.json();

    if (!renterId || !incidentId) {
      return NextResponse.json(
        { error: "Missing renterId or incidentId" },
        { status: 400 },
      );
    }

    const disputeRef = dbAdmin.collection("disputes").doc();
    await disputeRef.set({
      renterId,
      incidentId,
      renterStatement,
      submittedEvidence: evidenceUrls,
      adminNotes: "",
      status: "SUBMITTED",
      resolutionOutcome: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Link dispute to renter + incident
    await dbAdmin
      .collection("renters")
      .doc(renterId)
      .update({
        linkedDisputes: FieldValue.arrayUnion(disputeRef.id),
      });
    await dbAdmin.collection("incidents").doc(incidentId).update({
      relatedDispute: disputeRef.id,
      status: "DISPUTED",
    });

    return NextResponse.json({ success: true, id: disputeRef.id });
  } catch (err: any) {
    console.error("Error creating dispute:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
