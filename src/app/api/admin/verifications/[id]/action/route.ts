import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const { action, adminNotes } = body;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const docRef = adminDb.collection("identityVerifications").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json(
        { error: "Verification not found." },
        { status: 404 }
      );
    }

    const data = doc.data()!;
    const renter = data.renter;
    const searchSessionId = data.searchSessionId;

    // -----------------------------
    // 1. Update verification record
    // -----------------------------
    await docRef.update({
      status: action === "approve" ? "approved" : "rejected",
      adminNotes: adminNotes || "",
      reviewedAt: Date.now(),
    });

    // -----------------------------
    // 2. Update search session
    // -----------------------------
    if (searchSessionId) {
      await adminDb
        .collection("searchSessions")
        .doc(searchSessionId)
        .update({
          identityVerified: action === "approve",
          identityVerificationId: id,
        });
    }

    // -----------------------------
    // 3. Update renter master profile
    // -----------------------------
    const renterHash = renter.licenseNumber || renter.fullName;

    const rentersRef = adminDb
      .collection("renters")
      .where("identityHash", "==", renterHash);

    const renterDoc = await rentersRef.get();

    if (!renterDoc.empty) {
      const rId = renterDoc.docs[0].id;

      if (action === "approve") {
        await adminDb.collection("renters").doc(rId).update({
          verificationStatus: "verified",
          verifiedAt: Date.now(),
          verificationId: id,
        });
      } else {
        await adminDb.collection("renters").doc(rId).update({
          verificationStatus: "rejected",
          verificationId: id,
        });
      }
    }

    // -----------------------------
    // 4. Fraud tagging & signals
    // -----------------------------
    if (action === "reject") {
      await adminDb.collection("fraudFlags").add({
        renter,
        verificationId: id,
        reason: "Verification rejected",
        createdAt: Date.now(),
      });
      await adminDb.collection("fraudSignals").add({
        renter,
        type: "IDENTITY_REJECTED",
        scoreImpact: +25,
        rejectedAt: Date.now(),
      });
    } else if (action === "approve") {
      await adminDb.collection("fraudSignals").add({
        renter,
        type: "IDENTITY_VERIFIED",
        scoreImpact: -10,
        approvedAt: Date.now(),
      });
    }

    // -----------------------------
    // 5. Audit Log
    // -----------------------------
    await adminDb.collection("auditLogs").add({
      type: "VERIFICATION_REVIEW",
      verificationId: id,
      action,
      adminNotes: adminNotes || "",
      renter,
      timestamp: Date.now(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verification Action Error:", err);
    return NextResponse.json(
      { error: "Failed to process verification." },
      { status: 500 }
    );
  }
}
