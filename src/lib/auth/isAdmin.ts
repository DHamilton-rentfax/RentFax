import { adminAuth } from "@/firebase/server";

/**
 * Checks if a user has admin privileges by verifying their custom claims.
 * This is a standard and secure way to implement role-based access control in Firebase.
 */
export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const userRecord = await adminAuth.getUser(uid);
    // The `admin` custom claim must be set to `true` via the Firebase Admin SDK.
    return userRecord.customClaims?.['admin'] === true;
  } catch (error) {
    console.error(`Error checking admin status for UID: ${uid}`, error);
    return false;
  }
}
