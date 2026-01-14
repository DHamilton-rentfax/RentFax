process.env.GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS || "./service-account.json";

(async () => {
  console.log("🧪 Testing Firebase Admin…");

  const { adminAuth, adminDb } = await import("../src/firebase/server.js");

  const users = await adminAuth.listUsers(1);
  console.log("✅ Admin Auth OK. Sample users:", users.users.length);

  const snap = await adminDb.collection("users").limit(1).get();
  console.log("✅ Firestore OK. User docs:", snap.size);

  console.log("🎉 Firebase Admin fully operational");
  process.exit(0);
})().catch((err) => {
  console.error("❌ Admin test failed:", err);
  process.exit(1);
});
