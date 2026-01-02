import { adminDb } from "@/firebase/server";

export async function requireUser(uid: string) {
  const ref = adminDb.doc(`users/${uid}`);
  const snap = await ref.get();

  if (!snap.exists) {
    // This will be caught by the API route's error handling
    // and prevent any further execution.
    throw new Error("User document missing");
  }

  // Type assertion can be added here for more safety if you have a defined User type
  return snap.data();
}
