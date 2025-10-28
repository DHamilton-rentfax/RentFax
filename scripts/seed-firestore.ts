
// ===========================================
// RentFAX | Firestore Seeding Script
// Location: scripts/seed-firestore.ts
// ===========================================

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, writeBatch } from "firebase/firestore";
import { firebaseConfig } from "../src/firebase/client"; // Adjust path as needed

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function seedFirestore() {
    const batch = writeBatch(db);

    // 1. Seed Users
    const users = [
        { uid: "user-free-1", name: "Alice (Free)", email: "alice@example.com", planType: "free", remainingCredits: 0, subscriptionActive: false },
        { uid: "user-paid-1", name: "Bob (Pro 50)", email: "bob@example.com", planType: "pro50", remainingCredits: 50, subscriptionActive: true },
        { uid: "user-unlimited-1", name: "Charlie (Pro 300)", email: "charlie@example.com", planType: "pro300", remainingCredits: 300, subscriptionActive: true },
    ];

    users.forEach(user => {
        const userRef = doc(db, "users", user.uid);
        batch.set(userRef, user);
    });
    console.log("Seeding users...");


    // 2. Seed Renter Profiles
    const renters = [
        { renterId: "renter-123", name: "Dominique Hamilton", email: "dom@example.com", phone: "123-456-7890", address: "123 Main St"},
        { renterId: "renter-456", name: "Jane Doe", email: "jane@example.com", phone: "098-765-4321", address: "456 Oak Ave"},
    ]

    renters.forEach(renter => {
        const renterRef = doc(db, "renterProfiles", renter.renterId);
        batch.set(renterRef, renter)
    });
    console.log("Seeding renter profiles...");

    // 3. Seed Renter Reports
    const reports = [
        { reportId: "report-abc", renterId: "renter-123", summary: "Report for Dominique Hamilton...", incidents: 2, disputes: 0, riskScore: 85 },
        { reportId: "report-def", renterId: "renter-456", summary: "Report for Jane Doe...", incidents: 0, disputes: 1, riskScore: 62 },
    ]

    reports.forEach(report => {
        const reportRef = doc(db, "renterReports", report.reportId);
        batch.set(reportRef, report);
    });
    console.log("Seeding renter reports...");

    // 4. Seed Search Logs
    const searchLogs = [
        { userId: "user-paid-1", renterName: "Test Search", timestamp: new Date(), usedCredit: true, result: "no-match"},
    ];

    searchLogs.forEach(log => {
        const logRef = doc(collection(db, `searchLogs/${log.userId}/logs`));
        batch.set(logRef, log);
    });
    console.log("Seeding search logs...");


    // Commit the batch
    await batch.commit();
    console.log("Firestore seeding complete!");
}

seedFirestore().catch(console.error);
