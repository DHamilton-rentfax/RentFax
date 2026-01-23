import { adminDb } from "@/firebase/server";
import { NextResponse } from "next/server";
import { sendDisputeNotification } from "@/lib/notifications";
import { generateDisputeSummary } from "@/lib/ai-summary";
import { logAuditEvent } from "@/lib/audit-log";

export async function POST(req: Request) {
  try {
    const { disputeId, status, resolutionOutcome, adminNotes } =
      await req.json();
    if (!disputeId)
      return NextResponse.json({ error: "Missing disputeId" }, { status: 400 });

    const ref = adminDb.collection("disputes").doc(disputeId);
    const snap = await ref.get();
    if (!snap.exists)
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 });

    const dispute = snap.data()!;

    // 1️⃣ Generate AI summary
    const summary = await generateDisputeSummary({
      renterStatement: dispute.renterStatement,
      adminNotes,
      resolution: resolutionOutcome,
    });

    // 2️⃣ Update Firestore
    await ref.update({
      status,
      resolutionOutcome: resolutionOutcome || null,
      adminNotes: adminNotes || "",
      aiSummary: summary,
      updatedAt: new Date(),
    });

    // 3️⃣ Log the audit event
    await logAuditEvent({
      disputeId,
      action: "STATUS_UPDATED",
      actor: "ADMIN",
      details: `Status changed to ${status}`,
    });

    // 4️⃣ Send notification
    const renterRef = await adminDb
      .collection("renters")
      .doc(dispute.renterId)
      .get();
    if (renterRef.exists) {
      const renter = renterRef.data()!;
      await sendDisputeNotification({
        to: renter.email,
        subject: `Your dispute #${disputeId} has been updated`,
        message: `
          <p>Hello ${renter.name},</p>
          <p>Your dispute regarding incident <b>${dispute.incidentId}</b> has been updated to status <b>${status}</b>.</p>
          ${resolutionOutcome ? `<p>Resolution Outcome: ${resolutionOutcome}</p>` : ""}
          <p>You can log in to your Renter Portal to see details and AI-generated summary.</p>
          <p>– RentFAX Resolution Team</p>
        `,
      });
      await logAuditEvent({
        disputeId,
        action: "EMAIL_SENT",
        actor: "SYSTEM",
        details: `Notification sent to ${renter.email} for status update.`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error updating dispute:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
