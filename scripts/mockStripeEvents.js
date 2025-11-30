"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// This is a simplified mock. In a real app, you'd get the projectId from the initialized app.
// For this script, we'll assume it's set in the environment.
const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
if (!firebase_admin_1.default.apps.length) {
    firebase_admin_1.default.initializeApp({ projectId });
}
const db = firebase_admin_1.default.firestore();
async function simulateStripeEvents() {
    console.log(`Simulating Stripe events for project: ${projectId}`);
    const now = new Date();
    const demoEvents = [
        {
            type: "customer.created",
            data: { email: "demo@rentfax.io", plan: "Free" },
        },
        {
            type: "customer.subscription.created",
            data: { email: "demo@rentfax.io", plan: "Pro Monthly" },
        },
        {
            type: "invoice.payment_succeeded",
            data: { email: "demo@rentfax.io", amount: 2900 },
        },
    ];
    try {
        for (const event of demoEvents) {
            await db.collection("auditLogs").add({
                action: `STRIPE_MOCK_${event.type.toUpperCase()}`,
                performedBy: "system_seeder",
                role: "SYSTEM",
                targetId: event.data.email,
                metadata: event.data,
                timestamp: firebase_admin_1.default.firestore.FieldValue.serverTimestamp(),
            });
            console.log(`✅ Mocked event: ${event.type}`);
        }
        console.log("🎉 All demo events created in Firestore!");
    }
    catch (error) {
        console.error("❌ Failed to seed mock Stripe events:", error);
        console.error("Please ensure your FIREBASE_PROJECT_ID or GCLOUD_PROJECT environment variable is set correctly and that the script has permissions to write to Firestore.");
    }
}
simulateStripeEvents();
