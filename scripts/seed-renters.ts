
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as fs from "fs";

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_CERT!)),
  });
}
const db = getFirestore();

async function seedRenters() {
  const renters = JSON.parse(fs.readFileSync("./seed-renters.json", "utf8"));
  for (const r of renters) {
    await db.collection("renters").add({
      ...r,
      createdAt: new Date(),
    });
  }
  console.log("✅ Renters seeded");
}

seedRenters();
