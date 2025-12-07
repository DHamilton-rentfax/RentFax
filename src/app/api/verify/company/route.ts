import { NextResponse } from "next/server";
// This should be your server-side Firebase admin instance
// For this example, we'll assume a mock adminDB is available if not configured
import { adminDB } from "@/firebase/server"; 
import fetch from "node-fetch";

export async function POST(req: Request) {
  try {
    const { companyId, businessName, countryCode, registrationNumber, entityType } = await req.json();

    if (!companyId || !businessName || !countryCode || !entityType) {
        return NextResponse.json({ error: "companyId, businessName, entityType, and countryCode are required." }, { status: 400 });
    }

    // Ensure environment variable is set
    if (!process.env.TRULIOO_API_KEY) {
        console.error("Trulioo API key is not configured.");
        return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const response = await fetch("https://api.trulioo.com/v1/business/verify", {
      method: "POST",
      headers: {
        "x-trulioo-api-key": process.env.TRULIOO_API_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        AcceptTruliooTermsAndConditions: true, // This is required
        CountryCode: countryCode,
        Business: {
          BusinessName: businessName,
          BusinessRegistrationNumber: registrationNumber || "",
        },
      }),
    });

    const result = await response.json();

    const isVerified = result?.Record?.RecordStatus === "match" || result?.Record?.RecordStatus === "partial_match";

    // Save the detailed result to the correct Firestore collection based on entityType
    await adminDB.collection(entityType).doc(companyId).set({
      verified: isVerified,
      verificationStatus: isVerified ? "verified" : "failed",
      verificationDetails: {
        provider: "trulioo",
        verifiedAt: new Date(),
        requestId: result?.TransactionID,
        dataSummary: {
          companyName: result?.Record?.BusinessName || businessName,
          country: countryCode,
          registrationNumber: registrationNumber,
          matchLevel: result?.Record?.RecordStatus,
        },
      },
    }, { merge: true });

    return NextResponse.json({
      verified: isVerified,
      provider: "trulioo",
      matchStatus: result?.Record?.RecordStatus,
    });

  } catch (err: any) {
    console.error("Trulioo verification failed:", err);
    return NextResponse.json({ error: "Verification failed", details: err.message }, { status: 500 });
  }
}