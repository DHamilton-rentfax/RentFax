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
      return NextResponse.json(
        { error: "Token and verification value are required." },
        { status: 400 },
      );
    }

    const tokenDocRef = adminDB.collection("verifyTokens").doc(token);
    const tokenDoc = await tokenDocRef.get();

    if (!tokenDoc.exists) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 404 },
      );
    }

    const tokenData = tokenDoc.data()!;

    if (tokenData.used || tokenData.expiresAt.toDate() < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 404 },
      );
    }

    // Check against phone's last 4 or license's last 4
    const phoneLast4 = tokenData.phone
      ? String(tokenData.phone).slice(-4)
      : null;
    const licenseLast4 = tokenData.licenseNumber
      ? String(tokenData.licenseNumber).slice(-4)
      : null;

    if (
      verificationValue !== phoneLast4 &&
      verificationValue !== licenseLast4
    ) {
      return NextResponse.json(
        {
          error:
            "Verification failed. The provided value did not match our records.",
        },
        { status: 403 },
      );
    }

    // Mark token as used
    await tokenDocRef.update({ used: true });

    // Create a custom session token for the Renter Portal
    const customToken = await adminAuth.createCustomToken(tokenData.renterId, {
      isRenter: true,
      orgId: tokenData.orgId,
    });

    return NextResponse.json({ success: true, customToken });
  } catch (error: any) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 },
    );
  }
}
