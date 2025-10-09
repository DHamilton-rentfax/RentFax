
import { NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { randomBytes } from "crypto";

// This would be called by an admin/system action to initiate verification
export async function POST(req: Request) {
  try {
    const { renterId, orgId, email, phone, licenseNumber } = await req.json();

    if (!renterId || !orgId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const token = randomBytes(24).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Store the token with its metadata in Firestore
    await adminDB.collection("verifyTokens").doc(token).set({
      renterId,
      orgId,
      email,
      phone,
      licenseNumber,
      used: false,
      expiresAt,
    });
    
    // In a real flow, you'd now use this token to generate a verification link
    // and send it via email or SMS.
    // e.g., https://rentfax-revamp.web.app/renter/verify?token=...

    return NextResponse.json({ success: true, verificationToken: token });

  } catch (error: any) {
    console.error("Error creating verification token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
