
import { NextRequest, NextResponse } from "next/server";
import { adminDB } from "@/firebase/server";
import { adminAuth } from "@/lib/firebase-admin";

/**
 * Handles the verification of a renter's secure token.
 */
export async function POST(req: NextRequest) {
  try {
    const { token, verificationValue } = await req.json();

    if (!token || !verificationValue) {
      return NextResponse.json({ error: "Token and verification value are required." }, { status: 400 });
    }

    const tokenQuery = await adminDB.collection("verifyTokens").where("token", "==", token).limit(1).get();

    if (tokenQuery.empty) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 404 });
    }

    const tokenDoc = tokenQuery.docs[0];
    const tokenData = tokenDoc.data();

    if (tokenData.used || tokenData.expiresAt.toDate() < new Date()) {
      return NextResponse.json({ error: "Invalid or expired token." }, { status: 404 });
    }

    const renterDoc = await adminDB.doc(`renters/${tokenData.renterId}`).get();
    if (!renterDoc.exists) {
        return NextResponse.json({ error: "Associated renter account not found." }, { status: 404 });
    }

    const renter = renterDoc.data()!;
    
    // Check against phone's last 4 or license's last 4
    const phoneLast4 = renter.phone ? renter.phone.slice(-4) : null;
    const licenseLast4 = renter.licenseNumber ? renter.licenseNumber.slice(-4) : null;

    if (verificationValue !== phoneLast4 && verificationValue !== licenseLast4) {
      return NextResponse.json({ error: "Verification failed." }, { status: 403 });
    }

    // Mark token as used
    await tokenDoc.ref.update({ used: true });

    // Create a custom session token for the RRP
    const customToken = await adminAuth.createCustomToken(tokenData.renterId, { isRenter: true });

    return NextResponse.json({ success: true, customToken });

  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json({ error: "An internal error occurred." }, { status: 500 });
  }
}
