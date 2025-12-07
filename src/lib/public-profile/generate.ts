import crypto from "crypto";
import { adminDb } from "@/firebase/server";

export async function generatePublicProfileId(renterId: string) {
  const id = crypto.randomBytes(6).toString("base64url"); // short, unguessable

  await adminDb.collection("renters").doc(renterId).set(
    {
      publicProfileId: id,
      publicVisibility: "FULL",
    },
    { merge: true }
  );

  return id;
}
