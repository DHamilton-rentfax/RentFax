
/**
 * scripts/makeSuperAdmin.ts
 *
 * Usage:
 *   ts-node scripts/makeSuperAdmin.ts <FIREBASE_UID>
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

async function makeSuperAdmin(uid: string) {
  try {
    await getAuth().setCustomUserClaims(uid, { role: "super_admin" });
    console.log(`✅ Success: User ${uid} is now a Super Admin.`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to assign Super Admin:", err);
    process.exit(1);
  }
}

const uid = process.argv[2];
if (!uid) {
  console.error("❌ Please provide a Firebase UID.\nUsage: ts-node scripts/makeSuperAdmin.ts <UID>");
  process.exit(1);
}

makeSuperAdmin(uid);
