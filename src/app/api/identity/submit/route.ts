import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/firebase/server";
import crypto from "crypto";
import { sendEmail } from "@/lib/notifications/email";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const verifyId = form.get("verifyId")?.toString();
    if (!verifyId) {
      return NextResponse.json(
        { error: "Missing verification ID" },
        { status: 400 }
      );
    }

    const frontId = form.get("frontId") as File | null;
    const backId = form.get("backId") as File | null;
    const selfie = form.get("selfie") as File | null;

    const ref = adminDb.collection("identityChecks").doc(verifyId);
    const record = await ref.get();

    if (!record.exists) {
      return NextResponse.json(
        { error: "Verification link not found." },
        { status: 404 }
      );
    }

    const data = record.data()!;

    // ---------------------
    // HASH LICENSE NUMBER
    // ---------------------
    const hashedLicense =
      data.licenseNumber
        ? crypto.createHash("sha256").update(data.licenseNumber).digest("hex")
        : null;

    // ---------------------
    // STORAGE UPLOAD HELPERS
    // ---------------------
    const uploadFile = async (file: File, filename: string) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const bucket = adminStorage.bucket();
      const path = `identity/${verifyId}/${filename}`;
      const upload = bucket.file(path);

      await upload.save(buffer, {
        metadata: { contentType: file.type },
      });

      return path;
    };

    // ---------------------
    // UPLOAD FILES
    // ---------------------
    let frontPath = null;
    let backPath = null;
    let selfiePath = null;

    if (frontId) {
      frontPath = await uploadFile(frontId, "front-id.png");
    }
    if (backId) {
      backPath = await uploadFile(backId, "back-id.png");
    }
    if (selfie) {
      selfiePath = await uploadFile(selfie, "selfie.png");
    }

    // ---------------------
    // UPDATE FIRESTORE
    // ---------------------
    await ref.update({
      status: "pending_review",
      submittedAt: Date.now(),
      uploads: {
        frontId: frontPath,
        backId: backPath,
        selfie: selfiePath,
      },
      licenseHash: hashedLicense,
    });

    // ---------------------
    // AUDIT LOG
    // ---------------------
    await adminDb.collection("auditLogs").add({
      type: "IDENTITY_SUBMITTED",
      renterId: data?.renterId ?? null,
      verifyId,
      timestamp: Date.now(),
      licenseHash: hashedLicense,
    });

    // ---------------------
    // EMAIL CONFIRMATION
    // ---------------------
    await sendEmail({
      to: data.email,
      subject: "Your RentFAX Identity Verification Was Submitted",
      html: `
        <p>Hi ${data.fullName},</p>
        <p>Your identity verification has been submitted and is now pending review.</p>
        <p>You will receive another email once the review is complete.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal error processing verification." },
      { status: 500 }
    );
  }
}
