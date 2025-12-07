
import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/firebase/server";
import { v4 as uuid } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const token = form.get("token") as string;
    const frontId = form.get("frontId") as File;
    const backId = form.get("backId") as File;
    const selfie = form.get("selfie") as File;

    if (!token || !frontId || !backId || !selfie) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 1. Get verification request
    const docRef = adminDb.collection("identityVerifications").doc(token);
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 404 }
      );
    }

    const verifyData = snap.data();
    const renter = verifyData?.renter;
    if (!renter) {
      return NextResponse.json(
        { error: "Renter record missing." },
        { status: 500 }
      );
    }

    // 2. Upload files to Storage
    async function uploadToStorage(file: File, path: string) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const bucket = adminStorage.bucket();

      const uploaded = bucket.file(path);
      await uploaded.save(buffer, {
        contentType: file.type,
      });

      const [url] = await uploaded.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return url;
    }

    const softUid = uuid(); // unique renter identity UID

    const frontUrl = await uploadToStorage(
      frontId,
      `verify/${softUid}/front.jpg`
    );

    const backUrl = await uploadToStorage(
      backId,
      `verify/${softUid}/back.jpg`
    );

    const selfieUrl = await uploadToStorage(
      selfie,
      `verify/${softUid}/selfie.jpg`
    );

    // 3. Create Soft Account
    await adminDb
      .collection("rentersSoftAccounts")
      .doc(softUid)
      .set({
        uid: softUid,
        fullName: renter.fullName,
        email: renter.email ?? null,
        phone: renter.phone ?? null,
        verificationToken: token,
        documents: {
          frontIdUrl: frontUrl,
          backIdUrl: backUrl,
          selfieUrl,
        },
        verified: "pending",
        createdAt: Date.now(),
      });

    // 4. Update verification status
    await docRef.update({
      status: "submitted",
      softUid,
      submittedAt: Date.now(),
    });

    return NextResponse.json({ success: true, softUid });
  } catch (err) {
    console.error("Self-verify submit error:", err);
    return NextResponse.json(
      { error: "Failed to submit verification." },
      { status: 500 }
    );
  }
}
