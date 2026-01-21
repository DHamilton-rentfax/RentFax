import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/firebase/server";

export async function verifyRenterSession() {
  const sessionCookie = cookies().get("__session")?.value;
  if (!sessionCookie) {
    throw new Error("Unauthorized");
  }

  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);

  const renterSnap = await adminDb
    .collection("renters")
    .doc(decoded.uid)
    .get();

  if (!renterSnap.exists) {
    throw new Error("Renter not found");
  }

  return {
    renterId: decoded.uid,
    renter: renterSnap.data(),
  };
}
