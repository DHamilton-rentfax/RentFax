// SERVER-ONLY FILE
// SAFE: used by API routes only
import { adminDb } from "@/firebase/server";

export async function getVerifiedStatus(identityHash: string) {
  if (!identityHash) return { verified: false, method: null, timestamp: null };

  const doc = await adminDb
    .collection("identityVerified")
    .doc(identityHash)
    .get();

  if (!doc.exists) {
    return { verified: false, method: null, timestamp: null };
  }

  const data = doc.data();
  return {
    verified: data?.verified === true,
    method: data?.method || null,
    timestamp: data?.timestamp || null,
  };
}

export async function markIdentityVerified(identityHash: string, method: string) {
  await adminDb.collection("identityVerified").doc(identityHash).set({
    verified: true,
    method,
    timestamp: Date.now(),
  });
}
