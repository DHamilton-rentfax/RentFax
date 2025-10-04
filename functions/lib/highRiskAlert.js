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
exports.highRiskAlert = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
exports.highRiskAlert = functions.firestore
    .document('renters/{renterId}/fraud/summary')
    .onWrite(async (change, context) => {
    var _a;
    const { renterId } = context.params;
    const summary = change.after.data();
    if (!summary) {
        return null;
    }
    const signalCount = ((_a = summary.signals) === null || _a === void 0 ? void 0 : _a.length) || 0;
    const HIGH_SIGNAL_THRESHOLD = 5;
    const renterRef = db.doc(`renters/${renterId}`);
    if (signalCount > HIGH_SIGNAL_THRESHOLD) {
        return renterRef.set({ alert: true }, { merge: true });
    }
    return null;
});
//# sourceMappingURL=highRiskAlert.js.map