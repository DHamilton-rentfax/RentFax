import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import { Timestamp } from "firebase-admin/firestore";
import { logSystemEvent } from "@/lib/logging/systemLogger";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    const body = await req.json();
    const { action, disputeId, incidentId, renterId, overrideReason, mergeIntoId, adminId } = body;

    if (!adminId) {
      return NextResponse.json({ error: "Admin identity required" }, { status: 400 });
    }

    switch (action) {
      /* -------------------------------------------------- */
      case "approve_dispute": {
        await adminDb.collection("disputes").doc(disputeId).update({
          status: "approved",
          reviewedBy: adminId,
          reviewedAt: Timestamp.now(),
        });

        await logSystemEvent({
          type: "dispute_approved",
          actorId: adminId,
          message: `Dispute ${disputeId} approved by ${adminId}`,
          metadata: { disputeId, incidentId }
        });

        return NextResponse.json({ success: true });
      }

      /* -------------------------------------------------- */
      case "reject_dispute": {
        await adminDb.collection("disputes").doc(disputeId).update({
          status: "rejected",
          reviewedBy: adminId,
          reviewedAt: Timestamp.now(),
        });

        await logSystemEvent({
          type: "dispute_rejected",
          actorId: adminId,
          message: `Dispute ${disputeId} rejected by ${adminId}`,
          metadata: { disputeId, incidentId }
        });

        return NextResponse.json({ success: true });
      }

      /* -------------------------------------------------- */
      case "freeze_renter": {
        await adminDb.collection("renters").doc(renterId).update({
          status: "frozen",
          frozenAt: Timestamp.now(),
          frozenBy: adminId,
        });

        await logSystemEvent({
          type: "renter_frozen",
          actorId: adminId,
          severity: "critical",
          message: `Renter ${renterId} frozen by ${adminId}`,
        });

        return NextResponse.json({ success: true });
      }

      /* -------------------------------------------------- */
      case "unfreeze_renter": {
        await adminDb.collection("renters").doc(renterId).update({
          status: "active",
          unfrozenAt: Timestamp.now(),
          unfrozenBy: adminId,
        });

        await logSystemEvent({
          type: "renter_unfrozen",
          actorId: adminId,
          message: `Renter ${renterId} unfrozen`,
        });

        return NextResponse.json({ success: true });
      }

      /* -------------------------------------------------- */
      case "mark_high_risk": {
        await adminDb.collection("renters").doc(renterId).update({
          highRisk: true,
          highRiskAt: Timestamp.now(),
          highRiskBy: adminId,
        });

        await logSystemEvent({
          type: "renter_marked_high_risk",
          actorId: adminId,
          severity: "warning",
          message: `Renter ${renterId} flagged as HIGH RISK`,
        });

        return NextResponse.json({ success: true });
      }

      /* -------------------------------------------------- */
      case "merge_renters": {
        if (!mergeIntoId) {
          return NextResponse.json({ error: "mergeIntoId required" }, { status: 400 });
        }

        const sourceRef = adminDb.collection("renters").doc(renterId);
        const targetRef = adminDb.collection("renters").doc(mergeIntoId);

        const source = await sourceRef.get();
        const target = await targetRef.get();

        if (!source.exists || !target.exists)
          return NextResponse.json({ error: "Renter not found" }, { status: 404 });

        // Merge incidents
        const inc = await adminDb
          .collection("incidents")
          .where("renterId", "==", renterId)
          .get();

        const batch = adminDb.batch();
        inc.docs.forEach((d) => {
          batch.update(d.ref, { renterId: mergeIntoId });
        });

        // Mark old renter as merged
        batch.update(sourceRef, {
          mergedInto: mergeIntoId,
          mergedAt: Timestamp.now(),
          mergedBy: adminId,
          status: "merged",
        });

        await batch.commit();

        await logSystemEvent({
          type: "renter_merged",
          actorId: adminId,
          severity: "critical",
          message: `Renter ${renterId} merged into ${mergeIntoId}`,
        });

        return NextResponse.json({ success: true });
      }

      /* -------------------------------------------------- */
      case "escalate_incident": {
        await adminDb.collection("incidents").doc(incidentId).update({
          escalated: true,
          escalatedAt: Timestamp.now(),
          escalatedBy: adminId,
          escalationReason: overrideReason ?? "No reason provided",
        });

        await logSystemEvent({
          type: "incident_escalated",
          severity: "warning",
          actorId: adminId,
          message: `Incident ${incidentId} escalated for manual review`,
        });

        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
