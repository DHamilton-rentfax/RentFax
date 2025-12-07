
import { NextResponse } from "next/server";
import { adminDb, adminAuth } from "@/firebase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, uid } = body;

    // AUTH CHECK
    const user = await adminAuth.getUser(uid);
    if (!user || user.customClaims?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    switch (action) {
      case "approve_all_pending":
        return approveAllPending();
      case "reject_all_pending":
        return rejectAllPending();
      case "override_status":
        return overrideRenter(payload);
      case "update_pricing":
        return updatePricing(payload);
      case "rebuild_graphs":
        return rebuildGraphs();
      case "rescan_fraud":
        return rescanFraud();
      default:
        return NextResponse.json({ error: "Unknown Action" }, { status: 400 });
    }
  } catch (err) {
    console.error("Admin Tools Error:", err);
    return NextResponse.json(
      { error: "Failed to execute admin action" },
      { status: 500 }
    );
  }
}

// APPROVE ALL
async function approveAllPending() {
  const snap = await adminDb
    .collection("identityVerifications")
    .where("status", "==", "pending")
    .get();

  const batch = adminDb.batch();

  snap.forEach((doc) => {
    batch.update(doc.ref, {
      status: "approved",
      updatedAt: Date.now(),
    });
  });

  await batch.commit();

  return NextResponse.json({
    success: true,
    count: snap.size,
  });
}

// REJECT ALL
async function rejectAllPending() {
  const snap = await adminDb
    .collection("identityVerifications")
    .where("status", "==", "pending")
    .get();

  const batch = adminDb.batch();

  snap.forEach((doc) => {
    batch.update(doc.ref, {
      status: "rejected",
      updatedAt: Date.now(),
    });
  });

  await batch.commit();

  return NextResponse.json({
    success: true,
    count: snap.size,
  });
}

// OVERRIDE STATUS PER RENTER
async function overrideRenter(payload: any) {
  const { renterId, status } = payload;
  if (!renterId || !status) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  await adminDb.collection("renters").doc(renterId).update({
    verificationStatus: status,
    updatedAt: Date.now(),
  });

  return NextResponse.json({ success: true });
}

// UPDATE PRICING
async function updatePricing(payload: any) {
  await adminDb
    .collection("admin")
    .doc("globalControls")
    .set({ pricing: payload }, { merge: true });

  return NextResponse.json({ success: true, payload });
}

// FRAUD RESCAN (stub)
async function rescanFraud() {
  return NextResponse.json({ success: true, message: "Fraud rescan triggered" });
}

// REBUILD GRAPHS (stub)
async function rebuildGraphs() {
  return NextResponse.json({
    success: true,
    message: "Identity graphs rebuild started",
  });
}
