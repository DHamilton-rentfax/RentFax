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
exports.sendWeeklyDemoSummary = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const nodemailer_1 = __importDefault(require("nodemailer"));
admin.initializeApp();
const db = admin.firestore();
// Configure SMTP (e.g., Gmail, SendGrid, etc.)
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: functions.config().mailer.user,
        pass: functions.config().mailer.pass,
    },
});
// Helper: get count by event type
async function countEvents(event, start, end) {
    const snap = await db
        .collection("demoAnalytics")
        .where("event", "==", event)
        .where("createdAt", ">=", start)
        .where("createdAt", "<=", end)
        .get();
    return snap.size;
}
// Scheduled function — runs weekly
exports.sendWeeklyDemoSummary = functions.pubsub
    .schedule("every monday 09:00")
    .timeZone("America/New_York")
    .onRun(async () => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const renterCount = await countEvents("demo_role_selected", oneWeekAgo, now);
    const renterReportViews = await countEvents("demo_renter_report_viewed", oneWeekAgo, now);
    const companyCount = await countEvents("demo_company_dashboard_viewed", oneWeekAgo, now);
    const message = `
      Weekly RentFAX Demo Summary (last 7 days):

      👤 Renter demo entries: ${renterCount}
      📄 Renter report views: ${renterReportViews}
      🏢 Company demo entries: ${companyCount}

      Visit your Super Admin Dashboard for detailed logs.
    `;
    await transporter.sendMail({
        from: `"RentFAX Reports" <${functions.config().mailer.user}>`,
        to: "info@rentfax.io",
        subject: "Weekly RentFAX Demo Summary",
        text: message,
    });
    console.log("✅ Weekly demo summary email sent");
});
//# sourceMappingURL=demoSummary.js.map