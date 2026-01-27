import { FieldValue } from "firebase-admin/firestore";

// ===========================================
// RentFAX | Re-Verification API
// Location: src/app/api/report/reverify/route.ts
// ===========================================

import { NextResponse } from "next/server";
import { db } from "@/firebase/server";

import { randomUUID } from "crypto";

// Fictional external identity verification service
const ACME_IDENTITY_API_KEY = process.env.ACME_IDENTITY_API_KEY;
const ACME_IDENTITY_ENDPOINT = "https://api.acmeidentity.com/v1/verify";

export async function POST(req: Request) {
  try {
    const { renterId, userId } = await req.json();
    if (!renterId || !userId) {
      return NextResponse.json({ success: false, error: "Missing renterId or userId" }, { status: 400 });
    }

    // 🔹 1. Fetch renter's data for verification
    const renterRef = doc(db, "renterProfiles", renterId);
    const renterSnap = await getDoc(renterRef);

    if (!renterSnap.exists()) {
      return NextResponse.json({ success: false, error: "Renter not found" }, { status: 404 });
    }
    const renterData = renterSnap.data();

    // 🔹 2. Call external data API (AcmeIdentity)
    // This is a placeholder for the actual API call.
    // In a real scenario, you would use fetch() or an SDK.
    console.log("Calling AcmeIdentity for verification...", {
        name: renterData.name,
        email: renterData.emails[0], // Assuming the first email is primary
        phone: renterData.phone,
    });
    // const verifyRes = await fetch(ACME_IDENTITY_ENDPOINT, {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${ACME_IDENTITY_API_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     name: renterData.name,
    //     email: renterData.emails[0],
    //     phone: renterData.phone,
    //     address: renterData.address,
    //   }),
    // });
    // const verifyData = await verifyRes.json();

    // Using mock data for demonstration
    const verifyData = {
        success: true,
        verificationId: `vrf_${randomUUID()}`,
        riskProfile: {
            fraudScore: Math.floor(Math.random() * 100), // Score from 0-100
            identityVerified: Math.random() > 0.1, // 90% chance of being verified
        }
    };

    if (!verifyData.success || !verifyData.riskProfile.identityVerified) {
        console.warn("Identity verification failed for renter:", renterId, verifyData);
        // Optionally, you could flag the profile for manual review here
        return NextResponse.json({ success: false, error: "Verification failed" });
    }

    // 🔹 3. Update renter profile with fresh data
    await updateDoc(renterRef, {
      lastVerified: FieldValue.serverTimestamp(),
      needsReverify: false,
      riskScore: verifyData.riskProfile.fraudScore,
      lastVerificationProvider: "AcmeIdentity",
      lastVerificationId: verifyData.verificationId,
    });

    // 🔹 4. Log re-verification event for the user
    await updateDoc(doc(db, "users", userId), {
      lastVerificationRun: FieldValue.serverTimestamp(),
      // Optionally, you could store more details about the verification run
    });

    console.log(`✅ Successfully re-verified renter ${renterId} for user ${userId}.`);
    return NextResponse.json({ success: true, data: verifyData.riskProfile });

  } catch (err) {
    console.error("Re-verification API error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
