import { adminDb } from "@/firebase/server";

import { NextResponse } from "next/server";
import { getFirebaseAdminApp } from "@/lib/firebase-admin";


export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    const app = getFirebaseAdminApp();
    

    const sessionSnap = await adminDb.collection("searchStatus").doc(sessionId).get();

    if (!sessionSnap.exists) {
      const sessionByStripeId = await adminDb.collection("searchStatus").where("stripeSessionId", "==", sessionId).limit(1).get();
      if(sessionByStripeId.empty) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
      const realSessionSnap = sessionByStripeId.docs[0];
      const sessionData = realSessionSnap.data();
       // If renter already exists -> return it
      if (sessionData.renterId) {
        return NextResponse.json({ renterId: sessionData.renterId });
      }
    }

    const session = sessionSnap.exists() ? sessionSnap.data() : (await adminDb.collection("searchStatus").where("stripeSessionId", "==", sessionId).limit(1).get()).docs[0].data();

    // If renter already exists -> return it
    if (session.renterId) {
      return NextResponse.json({ renterId: session.renterId });
    }

    // If renter is new -> create them
    if (session.type === "IDENTITY_CHECK" && !session.renterId) {
      const ref = await adminDb.collection("renters").add({
        firstName: session.renterInput.firstName,
        lastName: session.renterInput.lastName,
        email: session.renterInput.email,
        phone: session.renterInput.phone,
        licenseNumber: session.renterInput.licenseNumber,
        country: session.renterInput.country || "United States",
        address: session.renterInput.addressLine1 || "",
        createdAt: new Date().toISOString(),
        createdFromSearchSession: sessionId,
      });

      // Save renter ID back to the session record
      await sessionSnap.ref.update({ renterId: ref.id });

      return NextResponse.json({ newRenterId: ref.id });
    }

    return NextResponse.json({
      error: "No renter found and no identity record to create.",
    });
  } catch (err: any) {
    console.error("Error resolving search:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
