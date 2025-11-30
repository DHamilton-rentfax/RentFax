// scripts/create-demo-users.ts

import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

// Load Admin SDK key
const saPath = path.join(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(saPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

async function createTestUser(email: string, role: string) {
  try {
    // Create Firebase Auth user
    const userRecord = await auth.createUser({
      email,
      password: "password123",
      emailVerified: true,
    });

    // Assign custom claims
    await auth.setCustomUserClaims(userRecord.uid, { role });

    // Save user record in Firestore
    await db.collection("users").doc(userRecord.uid).set({
      email,
      role,
      name: role[0].toUpperCase() + role.slice(1),
      createdAt: Timestamp.now(),
      companyId: "rentfax-main",
    });

    console.log(`✔ Created ${email} as ${role}`);
  } catch (err) {
    console.error(`❌ Error creating ${email}:`, err.message);
  }
}

async function main() {
  await createTestUser("renter@rentfax.io", "RENTER");
  await createTestUser("company@rentfax.io", "COMPANY_ADMIN");
  await createTestUser("landlord@rentfax.io", "LANDLORD");
}

main().then(() => {
  console.log("🎉 All demo users created!");
});
