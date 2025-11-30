const { adminDb } = require("../src/firebase/server");

async function main() {
  const renterId = "test-renter-001";

  await adminDb.collection("renters").doc(renterId).set({
    fullName: "Test Renter",
    email: "testrenter@example.com",
    phone: "555-123-4567",
    address: "123 Main St",
    licenseNumber: "D1234567",
    createdAt: Date.now(),

    // clean test state
    identity: null,
    fraud: null,
    publicData: null,
    incidents: [],
    riskScore: 40,
    confidence: 0.8,
  });

  console.log("Test renter seeded:", renterId);
}

main();
