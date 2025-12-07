import { NextResponse } from "next/server";
import { admin, adminDb } from "@/firebase/server";
import { logVerificationEvent } from "@/lib/audit/logVerification";
import { sendEmail } from "@/lib/notifications/email";
import { sendSMS } from "@/lib/notifications/sms";
import { addIdentitySignal } from "@/lib/fraud/addIdentitySignal";
import { generateIdentityHash } from "@/lib/identity-hash";

export async function POST(req: Request) {
  try {
    const { id, status, adminNotes } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    await adminDb.collection("identityVerifications").doc(id).update({
      status,
      adminNotes: adminNotes || "",
      reviewedAt: Date.now(),
    });

    const doc = await adminDb.collection("identityVerifications").doc(id).get();
    const data = doc.data();

    if (!data) {
      return NextResponse.json(
        { error: "Verification document not found after update." },
        { status: 404 }
      );
    }

    if (status === "approved") {
      if (data?.renter?.email) {
        const renterSnap = await adminDb
          .collection("renters")
          .where("email", "==", data.renter.email)
          .limit(1)
          .get();

        if (!renterSnap.empty) {
          const ref = renterSnap.docs[0].ref;
          const ocr = data.ocr ?? {};

          await ref.update({
            verified: true,
            verificationStatus: "approved",
            verifiedAt: Date.now(),
            verificationType: "manual_admin_approval",
            idNumber: ocr.idNumber ?? null,
            dateOfBirth: ocr.dob ?? null,
            identityScore: data.ai?.identityScore ?? null,
            faceMatch: data.ai?.faceSimilarity ?? null,
            ocrExtract: ocr,
          });
          
          const identityHash = generateIdentityHash({
            fullName: data.ocr?.name,
            dob: data.ocr?.dob,
            licenseNumber: data.ocr?.idNumber,
            emails: [data.renter.email],
            phones: [data.renter.phone],
          });

          await ref.update({ identityHash });
        }
      }
      
      await addIdentitySignal({
        renterEmail: data.renter.email,
        verificationId: id,
        identityScore: data.ai?.identityScore ?? 0,
        faceMatch: data.ai?.faceSimilarity ?? 0,
      });

    } else if (status === "rejected") {
      if (data?.renter?.email) {
        const renterSnap = await adminDb
          .collection("renters")
          .where("email", "==", data.renter.email)
          .limit(1)
          .get();

        if (!renterSnap.empty) {
          await renterSnap.docs[0].ref.update({
            verified: false,
            verificationStatus: "rejected",
            reviewedAt: Date.now(),
            verificationType: "manual_admin_rejection",
          });
        }
      }
    }

    await logVerificationEvent({
      adminId: "SUPER_ADMIN", // later replace w/ auth admin id
      renterEmail: data.renter.email,
      verificationId: id,
      action: status === "approved" ? "APPROVED" : "REJECTED",
      notes: adminNotes,
    });
    
    if (status === "approved") {
        if (data.renter.email) {
            await sendEmail({
            to: data.renter.email,
            subject: "Your RentFAX Verification Has Been Approved",
            html: `
                <p>Hello ${data.renter.fullName},</p>
                <p>Your identity verification has been successfully approved.</p>
                <p>You are now marked as a Verified Renter on RentFAX.</p>
            `,
            });
        }

        if (data.renter.phone) {
            await sendSMS(
            data.renter.phone,
            "RentFAX: Your identity verification has been approved."
            );
        }
    }

    if (status === "rejected") {
        if (data.renter.email) {
            await sendEmail({
            to: data.renter.email,
            subject: "Your RentFAX Verification Could Not Be Approved",
            html: `
                <p>Hello ${data.renter.fullName},</p>
                <p>Unfortunately, your identity verification was not approved.</p>
                <p>Please double-check your information and try again.</p>
            `,
            });
        }

        if (data.renter.phone) {
            await sendSMS(
            data.renter.phone,
            "RentFAX: Your identity verification was not approved. Please try again."
            );
        }
    }

    if (data.searchSessionId) {
      await adminDb
        .collection("searchSessions")
        .doc(data.searchSessionId)
        .update({
          identityVerified: status === "approved",
          identityVerificationId: id,
        });
    }

    await adminDb
      .collection("analytics")
      .doc("global")
      .set(
        {
          identityApprovals: admin.firestore.FieldValue.increment(
            status === "approved" ? 1 : 0
          ),
          identityRejections: admin.firestore.FieldValue.increment(
            status === "rejected" ? 1 : 0
          ),
        },
        { merge: true }
      );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Verify update error:", err);
    return NextResponse.json(
      { error: "Failed to update verification." },
      { status: 500 }
    );
  }
}
