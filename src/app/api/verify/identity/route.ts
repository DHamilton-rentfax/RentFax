import { NextResponse } from "next/server";
import { getAdminDb } from "@/firebase/server";
import fetch from "node-fetch";

export async function POST(req: Request) {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    // Assuming you pass a userId and the type of collection it belongs to
    const { userId, userType, firstName, lastName, email, phone, address } = await req.json();

    if (!userId || !userType || !email || !phone) {
        return NextResponse.json({ error: "userId, userType, email, and phone are required"}, { status: 400 });
    }

    if (!process.env.EKATA_API_KEY) {
        console.error("Ekata API key is not configured.");
        return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const response = await fetch("https://api.ekata.com/identity_check", {
      method: "POST",
      // Ekata uses Basic Auth with the API key as the username.
      headers: {
        "Authorization": "Basic " + Buffer.from(`${process.env.EKATA_API_KEY}:`).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        primary: {
            email: email,
            phone: phone,
            name: `${firstName || ''} ${lastName || ''}`.trim(),
            address: address, // Can be an object with street, city, etc.
        }
      }),
    });

    const result = await response.json();

    // Define verification success based on Ekata's response.
    // A high identity check score and multiple checks being valid is a good indicator.
    const isVerified = (result?.identity_check?.score ?? 0) >= 0.75 && 
                       result?.email?.is_valid && 
                       result?.phone?.is_valid;

    await adminDb.collection(userType).doc(userId).set({
      verified: isVerified,
      verificationStatus: isVerified ? "verified" : (result?.warnings?.length > 0 ? "partial" : "failed"),
      verificationDetails: {
        provider: "ekata",
        verifiedAt: new Date(),
        requestId: result?.id,
        dataSummary: {
          matchLevel: result?.identity_check?.summary,
          confidenceScore: result?.identity_check?.score,
          emailValid: result?.email?.is_valid,
          phoneValid: result?.phone?.is_valid,
        },
      },
    }, { merge: true });

    return NextResponse.json({
      verified: isVerified,
      confidence: result?.identity_check?.score,
    });
  } catch (err: any) {
    console.error("Ekata verification error:", err);
    return NextResponse.json({ error: "Verification failed", details: err.message }, { status: 500 });
  }
}
