import { NextResponse } from "next/server";
import { adminDb } from "@/firebase/server";
import { sendEmail } from "@/lib/notifications/email";

export async function POST(req: Request) {
  try {
    // Implement your authentication check here for admin users

    const { token, status, notes } = await req.json();

    if (!token || !status) {
      return NextResponse.json({ error: "Missing parameters." }, { status: 400 });
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const docRef = adminDb.collection("identityVerifications").doc(token);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }

    const sessionData = doc.data() as any;

    await docRef.update({
      status,
      adminNotes: notes || null,
      [`${status}At`]: Date.now(),
      // adminReviewer: 'admin_user_id' // Get this from your auth
    });

    if (status === "approved") {
      const renterQuery = await adminDb
        .collection("renters")
        .where("email", "==", sessionData.renter.email)
        .get();
      for (const renterDoc of renterQuery.docs) {
        await renterDoc.ref.update({
          identityStatus: "verified",
          identityVerifiedAt: Date.now(),
        });
      }
    } else if (status === "rejected") {
      const renterQuery = await adminDb
        .collection("renters")
        .where("email", "==", sessionData.renter.email)
        .get();
      for (const renterDoc of renterQuery.docs) {
        await renterDoc.ref.update({
          identityStatus: "failed",
        });
      }
    }

    // Send email notification to the renter
    if (sessionData.renter?.email) {
      const subject = status === "approved"
          ? "RentFAX Identity Verified"
          : "RentFAX Verification Review";
      const body = status === "approved"
          ? `<p>Hello ${sessionData.renter.fullName},</p><p>Your identity has been successfully verified.</p>`
          : `<p>Hello ${sessionData.renter.fullName},</p><p>We could not verify your submission. Please resubmit with clearer photos.</p>`;
      
      await sendEmail({
        to: sessionData.renter.email,
        subject,
        html: body,
      });
    }

    // Audit Log
    await adminDb.collection("auditLogs").add({
      type: `identity_${status}`,
      token,
      // user: 'admin_user_id',
      timestamp: Date.now(),
      notes: notes || null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin update error:", err);
    return NextResponse.json({ error: "Failed to update session." }, { status: 500 });
  }
}
