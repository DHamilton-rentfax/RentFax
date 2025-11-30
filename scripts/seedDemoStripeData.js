"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT });
}
const db = firebase_admin_1.default.firestore();
async function seedDemoData() {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
    console.log(`Seeding demo data for project: ${projectId}`);
    const companies = [
        { name: "Horizon Realty", plan: "Pro", monthlyRevenue: 299 },
        { name: "Acme Rentals", plan: "Starter", monthlyRevenue: 99 },
        { name: "Sunset Properties", plan: "Pro", monthlyRevenue: 299 },
        { name: "BrightStay Housing", plan: "Enterprise", monthlyRevenue: 899 },
    ];
    try {
        for (const company of companies) {
            const docRef = db.collection("subscriptions").doc();
            await docRef.set({
                companyName: company.name,
                plan: company.plan,
                status: "active",
                monthlyRevenue: company.monthlyRevenue,
                createdAt: new Date().toISOString(),
                demo: true,
            });
            console.log(`✅ Added ${company.name} (${company.plan})`);
        }
        await db.collection("analytics").doc("demoMetrics").set({
            totalCustomers: 42,
            activeSubscriptions: 38,
            mrr: 5820,
            churnRate: 3.4,
            demo: true,
        });
        console.log("🎉 Demo Stripe-like data seeded successfully!");
    }
    catch (error) {
        console.error("❌ Failed to seed demo Stripe data:", error);
        console.error("Please ensure your FIREBASE_PROJECT_ID or GCLOUD_PROJECT environment variable is set correctly and that the script has permissions to write to Firestore.");
    }
}
seedDemoData().catch(console.error);
