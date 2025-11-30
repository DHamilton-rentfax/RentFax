"use server";

import { adminDB } from "@/firebase/server";

import { getFraudSignals } from "./fraud-signals";

// A series of mock users designed to trigger fraud detection signals
const mockUsers = [
  {
    uid: "user-001",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    phone: "123-555-0101",
    ssn: "XXX-XX-1111",
    address: "123 Maple St, Springfield, IL",
    lastLoginIp: "192.168.1.1",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    uid: "user-002",
    name: "Bob Williams",
    email: "bob.w@example.com", // Unique email
    phone: "123-555-0102",
    ssn: "XXX-XX-2222",
    address: "456 Oak Ave, Springfield, IL",
    lastLoginIp: "192.168.1.2",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    uid: "user-003",
    name: "Charlie Brown",
    email: "charlie.b@example.com",
    phone: "123-555-0102", // Duplicate phone with user-002
    ssn: "XXX-XX-3333",
    address: "789 Pine Ln, Springfield, IL",
    lastLoginIp: "192.168.1.3",
    createdAt: new Date(),
  },
  {
    uid: "user-004",
    name: "Diana Miller",
    email: "diana.m@example.com",
    phone: "123-555-0104",
    ssn: "XXX-XX-3333", // Duplicate SSN with user-003
    address: "101 Main St, Shelbyville, IL",
    lastLoginIp: "192.168.1.4",
    createdAt: new Date(),
  },
  {
    uid: "user-005",
    name: "Eve Davis",
    email: "eve.d@example.com",
    phone: "123-555-0105",
    ssn: "XXX-XX-5555",
    address: "101 Main St, Shelbyville, IL", // Duplicate Address with user-004
    lastLoginIp: "192.168.1.1", // Duplicate IP with user-001
    createdAt: new Date(Date.now() - 60 * 1000), // 1 minute ago
  },
  {
    uid: "user-006",
    name: "Frank White",
    email: "franky@mailinator.com", // Disposable email
    phone: "123-555-0106",
    ssn: "XXX-XX-6666",
    address: "222 Elm St, Capital City, IL",
    lastLoginIp: "192.168.1.6",
    createdAt: new Date(),
  },
  {
    uid: "user-007",
    name: "Grace Taylor",
    email: "alice.j@example.com", // Duplicate email with user-001
    phone: "123-555-0107",
    ssn: "XXX-XX-7777",
    address: "333 Cedar Blvd, Capital City, IL",
    lastLoginIp: "192.168.1.7",
    createdAt: new Date(),
  },
];

export async function seedInitialUsers() {
  const batch = adminDB.batch();

  mockUsers.forEach((user) => {
    const { uid, ...userData } = user;
    const docRef = adminDB.collection("users").doc(uid);
    batch.set(docRef, userData);
  });

  try {
    await batch.commit();
    return {
      success: true,
      message: `${mockUsers.length} users have been seeded successfully.`,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function runFraudAnalysisOnSeededUsers() {
  try {
    const usersSnapshot = await adminDB.collection("users").get();
    const userIds = usersSnapshot.docs.map((doc) => doc.id);
    let processedCount = 0;

    for (const userId of userIds) {
      await getFraudSignals(userId);
      processedCount++;
    }

    return {
      success: true,
      message: `Fraud analysis completed for ${processedCount} users.`,
    };
  } catch (error: any) {
    console.error("Error running fraud analysis:", error);
    return { success: false, error: error.message };
  }
}
