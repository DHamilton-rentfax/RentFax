import { NextResponse } from "next/server";
import { adminDb, adminStorage } from "@/firebase/server";

export const runtime = "nodejs"; // IMPORTANT — allows file uploads

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const file = form.get("file") as File | null;
    const token = form.get("token") as string | null;
    const type = form.get("type") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "Missing file." },
        { status: 400 }
      );
    }
    if (!token) {
      return NextResponse.json(
        { error: "Missing verification token." },
        { status: 400 }
      );
    }
    if (!type || !["frontId", "backId", "selfie"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid file type." },
        { status: 400 }
      );
    }

    // --------------------------------------------
    // 1. Validate verification record exists
    // --------------------------------------------
    const ref = adminDb.collection("identityVerifications").doc(token);
    const snap = await ref.get();

    if (!snap.exists) {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 404 }
      );
    }

    // --------------------------------------------
    // 2. Validate MIME type
    // --------------------------------------------
    const validMime = ["image/jpeg", "image/png", "image/jpg"];
    if (!validMime.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPG/PNG images are allowed." },
        { status: 400 }
      );
    }

    // --------------------------------------------
    // 3. Upload to Firebase Storage
    // --------------------------------------------
    const buffer = Buffer.from(await file.arrayBuffer());

    const bucket = adminStorage.bucket();
    const fileName = `identity-verifications/${token}/${type}-${Date.now()}.jpg`;

    const storageFile = bucket.file(fileName);

    await storageFile.save(buffer, {
      contentType: file.type,
      public: false,
      metadata: {
        cacheControl: "no-store",
      },
    });

    // Generate a signed URL (private but accessible for a short time)
    const [url] = await storageFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // --------------------------------------------
    // 4. Store metadata (not final submission yet)
    // --------------------------------------------
    await ref.update({
      [`${type}Url`]: url,
      updatedAt: Date.now(),
    });

    return NextResponse.json({ success: true, url });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 }
    );
  }
}
