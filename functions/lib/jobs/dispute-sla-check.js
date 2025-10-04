"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeSlaCheck = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
// This is a placeholder for the actual createNotification function
// In a real scenario, you would import this from its actual file location
async function createNotification(notification) {
    try {
        const docRef = await admin.firestore().collection("notifications").add(Object.assign(Object.assign({}, notification), { createdAt: admin.firestore.FieldValue.serverTimestamp(), read: false }));
        console.log("Notification created with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    }
    catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error };
    }
}
exports.disputeSlaCheck = functions.pubsub
    .schedule("every 24 hours")
    .onRun(async () => {
    const db = admin.firestore();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const slaBreachedDisputes = await db
        .collection("disputes")
        .where("status", "in", ["open", "pending"])
        .where("createdAt", "<", admin.firestore.Timestamp.fromDate(sevenDaysAgo))
        .get();
    if (slaBreachedDisputes.empty) {
        console.log("No SLA breaches found.");
        return null;
    }
    console.log(`Found ${slaBreachedDisputes.size} SLA breaches.`);
    const notificationPromises = [];
    slaBreachedDisputes.docs.forEach((doc) => {
        const message = `Dispute #${doc.id} has been open for more than 7 days and has breached the SLA.`;
        const notification = {
            message,
            userId: "SUPER_ADMIN",
            priority: "high",
            type: "DISPUTE_SLA_BREACH",
            link: `/admin/super-dashboard/disputes/${doc.id}`,
        };
        notificationPromises.push(createNotification(notification));
    });
    await Promise.all(notificationPromises);
    return null;
});
//# sourceMappingURL=dispute-sla-check.js.map