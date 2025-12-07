import { adminDb } from "@/firebase/server";

export async function addIdentitySignal({
  renterEmail,
  verificationId,
  identityScore,
  faceMatch,
}: {
  renterEmail: string;
  verificationId: string;
  identityScore: number;
  faceMatch: number;
}) {
  await adminDb.collection("fraudSignals").add({
    renterEmail,
    type: "IDENTITY_VERIFICATION",
    verificationId,
    identityScore,
    faceMatch,
    createdAt: Date.now(),
  });
}
