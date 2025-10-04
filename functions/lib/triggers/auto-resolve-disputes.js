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
exports.autoResolveDisputeAlerts = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const db = admin.firestore();
exports.autoResolveDisputeAlerts = functions.firestore
    .document("disputes/{disputeId}")
    .onUpdate(async (change, context) => {
    const newData = change.after.data();
    if (!newData)
        return;
    if (["resolved", "closed"].includes(newData.status)) {
        const alertsRef = db.collection("alerts");
        const snap = await alertsRef
            .where("targetId", "==", context.params.disputeId)
            .where("type", "==", "DISPUTE_OVERDUE")
            .get();
        for (const doc of snap.docs) {
            await doc.ref.update({
                status: "resolved",
                resolvedAt: new Date(),
            });
            console.log(`✅ Resolved alert for dispute ${context.params.disputeId}`);
        }
    }
});
//# sourceMappingURL=auto-resolve-disputes.js.map