import dotenv from "dotenv";

import { adminAuth, adminDB } from "@/firebase/server";

dotenv.config({ path: ".env.local" });

async function promoteUser(uid: string) {
  try {
    await adminAuth.setCustomUserClaims(uid, { role: "SUPER_ADMIN" });
    console.log(`Successfully promoted user ${uid} to SUPER_ADMIN`);

    // Also update the user's role in Firestore
    const userRef = adminDB.collection("users").doc(uid);
    await userRef.set({ role: "SUPER_ADMIN" }, { merge: true });
    console.log(`Successfully updated user ${uid} role in Firestore`);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  }
}

const uid = process.argv[2];

if (!uid) {
  console.error("Please provide a UID as a command-line argument.");
  process.exit(1);
}

promoteUser(uid).then(() => process.exit(0));
