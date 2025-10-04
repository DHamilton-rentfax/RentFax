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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoResolveFraudAlerts = exports.autoResolveDisputeAlerts = exports.checkCriticalAlerts = exports.sendSmsAlert = exports.weeklyDigest = exports.dailyDigest = exports.disputeSlaCheck = exports.notifySlack = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const node_fetch_1 = __importDefault(require("node-fetch"));
// This check is to prevent multiple initializations in the same session
if (admin.apps.length === 0) {
    admin.initializeApp();
}
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || "";
// Fire when new notifications are created
exports.notifySlack = functions.firestore
    .document("notifications/{id}")
    .onCreate(async (snap) => {
    const data = snap.data();
    if (!data)
        return;
    // Only push high-priority alerts to Slack
    if (data.priority !== "high")
        return;
    const slackMessage = {
        text: `🚨 *${data.type.replace("_", " ")}*`,
        attachments: [
            {
                color: "#ff0000",
                fields: [
                    { title: "Message", value: data.message, short: false },
                    { title: "Link", value: `${process.env.APP_URL}${data.link || ""}`, short: false },
                    { title: "Created At", value: new Date(data.createdAt.toDate()).toLocaleString(), short: true },
                ],
            },
        ],
    };
    try {
        await (0, node_fetch_1.default)(SLACK_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(slackMessage),
        });
        console.log(`✅ Slack notified: ${data.type}`);
    }
    catch (err) {
        console.error("❌ Slack notification failed", err);
    }
});
var dispute_sla_check_1 = require("./jobs/dispute-sla-check");
Object.defineProperty(exports, "disputeSlaCheck", { enumerable: true, get: function () { return dispute_sla_check_1.disputeSlaCheck; } });
var digest_1 = require("./jobs/digest");
Object.defineProperty(exports, "dailyDigest", { enumerable: true, get: function () { return digest_1.dailyDigest; } });
Object.defineProperty(exports, "weeklyDigest", { enumerable: true, get: function () { return digest_1.weeklyDigest; } });
var sms_alert_1 = require("./jobs/sms-alert");
Object.defineProperty(exports, "sendSmsAlert", { enumerable: true, get: function () { return sms_alert_1.sendSmsAlert; } });
var check_critical_alerts_1 = require("./jobs/check-critical-alerts");
Object.defineProperty(exports, "checkCriticalAlerts", { enumerable: true, get: function () { return check_critical_alerts_1.checkCriticalAlerts; } });
var auto_resolve_disputes_1 = require("./triggers/auto-resolve-disputes");
Object.defineProperty(exports, "autoResolveDisputeAlerts", { enumerable: true, get: function () { return auto_resolve_disputes_1.autoResolveDisputeAlerts; } });
var auto_resolve_fraud_1 = require("./triggers/auto-resolve-fraud");
Object.defineProperty(exports, "autoResolveFraudAlerts", { enumerable: true, get: function () { return auto_resolve_fraud_1.autoResolveFraudAlerts; } });
//# sourceMappingURL=index.js.map