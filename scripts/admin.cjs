const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

/**
 * This file is the ONLY place scripts initialize Firebase Admin.
 * It avoids TS, avoids ts-node, avoids build issues.
 */

console.log("🧩 admin.cjs loading...");

// Ensure credentials exist
const credPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.resolve(process.cwd(), "service-account.json");

if (!fs.existsSync(credPath)) {
  throw new Error(`❌ Service account not found at ${credPath}`);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(fs.readFileSync(credPath, "utf8"))
    ),
  });
}

console.log("🔥 Firebase Admin initialized");

const adminAuth = admin.auth();
const adminDb = admin.firestore();

module.exports = { adminAuth, adminDb };
