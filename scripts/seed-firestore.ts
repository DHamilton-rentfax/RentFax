// scripts/seed-firestore.ts
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import path from "path";
import fs from "fs";

// 1) Load your service account JSON
//    Put your service account file at: ./serviceAccountKey.json
const serviceAccountPath = path.join(process.cwd(), "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(
    `serviceAccountKey.json not found at ${serviceAccountPath}. ` +
      `Download it from Firebase Console (Project settings ➜ Service accounts).`
  );
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
) as ServiceAccount;

// 2) Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

async function seedDatabase() {
  const batch = db.batch();

  console.log("🔥 Starting Firestore seed...");

  // --- SUPER ADMIN USER & ORG ---

  const superAdminId = "auth_uid_superadmin_01"; // can be any string for now
  const userRef = db.collection("users").doc(superAdminId);

  batch.set(userRef, {
    email: "info@rentfax.io",
    name: "Super Admin",
    role: "SUPER_ADMIN",
    companyId: "rentfax-main",
    createdAt: Timestamp.now(),
  });

  const orgRef = db.collection("orgs").doc();
  batch.set(orgRef, {
    name: "RentFAX Main",
    email: "info@rentfax.io",
    ownerId: superAdminId,
    role: "SUPER_ADMIN",
    createdAt: Timestamp.now(),
  });

  // --- COMPANIES ---

  const company1Ref = db.collection("companies").doc();
  batch.set(company1Ref, {
    name: "Reliable Property Management",
    ownerId: superAdminId,
    plan: "pro",
    status: "active",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    address: {
      street: "123 Main St",
      city: "Atlanta",
      state: "GA",
      zip: "30301",
    },
  });

  const company2Ref = db.collection("companies").doc();
  batch.set(company2Ref, {
    name: "Solutions Co.",
    ownerId: superAdminId,
    plan: "starter",
    status: "pending_verification",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  // --- RENTERS ---

  const renter1Ref = db.collection("renters").doc();
  batch.set(renter1Ref, {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "555-001-0001",
    createdAt: Timestamp.now(),
  });

  const renter2Ref = db.collection("renters").doc();
  batch.set(renter2Ref, {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "555-002-0002",
    createdAt: Timestamp.now(),
  });

  // --- INCIDENTS ---

  const incident1Ref = db.collection("incidents").doc();
  batch.set(incident1Ref, {
    renterId: renter1Ref.id,
    companyId: company1Ref.id,
    type: "unpaid_balance",
    description: "Final month rent outstanding.",
    amount: 1500,
    status: "disputed",
    occurredAt: Timestamp.fromDate(new Date("2025-10-31T10:00:00Z")),
    createdAt: Timestamp.now(),
  });

  const incident2Ref = db.collection("incidents").doc();
  batch.set(incident2Ref, {
    renterId: renter2Ref.id,
    companyId: company2Ref.id,
    type: "property_damage",
    description: "Large stain on living room carpet.",
    amount: 250.5,
    status: "reported",
    occurredAt: Timestamp.fromDate(new Date("2025-10-25T10:00:00Z")),
    createdAt: Timestamp.now(),
  });

  // --- DISPUTES ---

  const dispute1Ref = db.collection("disputes").doc();
  batch.set(dispute1Ref, {
    renterId: renter1Ref.id,
    incidentId: incident1Ref.id,
    companyId: company1Ref.id,
    status: "pending_review",
    explanation: "I believe this was paid. Checking my bank records.",
    evidence: [] as string[],
    adminNotes: "",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  // --- FRAUD SIGNALS (SUBCOLLECTION) ---

  const fraudSummaryRef = db
    .collection("renters")
    .doc(renter2Ref.id)
    .collection("fraud_signals")
    .doc("summary");

  batch.set(fraudSummaryRef, {
    score: 85,
    alert: true,
    signals: [
      {
        type: "duplicate_email",
        confidence: 0.9,
        explanation:
          "Email is associated with another profile created 2 days ago.",
        related: ["someOtherRenterId"],
      },
    ],
    status: "unreviewed",
    updatedAt: Timestamp.now(),
  });

  // --- BLOG POST (for Blog Manager) ---

  const blogRef = db.collection("blogs").doc("your-first-blog-post");
  batch.set(blogRef, {
    Title: "Your First Blog Post",
    Author: "Super Admin",
    Body: "<h1>Welcome!</h1><p>This is the body of the blog post.</p>",
    Excerpt: "A short summary of the post...",
    Published: true,
    Date: new Date().toISOString(),
    Image: "",
    Read: "0",
  });

  await batch.commit();
  console.log("✅ Firestore has been seeded successfully!");
}

seedDatabase().catch((error) => {
  console.error("❌ Error seeding database:", error);
  process.exit(1);
});