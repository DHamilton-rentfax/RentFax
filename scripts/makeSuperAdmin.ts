
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

async function makeSuperAdmin(uid: string) {
  await getAuth().setCustomUserClaims(uid, { role: "super_admin" });
  console.log(`✅ User ${uid} is now a Super Admin`);
}

const uid = process.argv[2]; // pass user UID as argument
if (!uid) {
  console.error("❌ Please provide a UID");
  process.exit(1);
}
makeSuperAdmin(uid);
