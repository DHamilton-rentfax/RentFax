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
exports.sendMonthlyReport = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_admin_1 = require("../lib/firebase-admin");
const storage_1 = require("firebase-admin/storage");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const jspdf_1 = require("jspdf");
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
exports.sendMonthlyReport = functions.pubsub
    .schedule("0 9 1 * *") // every 1st of month at 9 AM
    .timeZone("America/New_York")
    .onRun(async () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    // Revenue + events aggregation
    const billingSnap = await firebase_admin_1.adminDB
        .collection("billingEvents")
        .where("timestamp", ">=", startDate)
        .get();
    const eventsSnap = await firebase_admin_1.adminDB
        .collection("analyticsEvents")
        .where("ts", ">=", startDate.getTime())
        .get();
    let totalRevenue = 0;
    billingSnap.forEach((doc) => {
        totalRevenue += doc.data().amount || 0;
    });
    // Create PDF
    const pdf = new jspdf_1.jsPDF();
    pdf.setFontSize(18);
    pdf.text("RentFAX Monthly Investor Report", 14, 20);
    pdf.setFontSize(12);
    pdf.text(`Period: ${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`, 14, 35);
    pdf.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 45);
    pdf.text(`Events Logged: ${eventsSnap.size}`, 14, 55);
    eventsSnap.docs.slice(0, 15).forEach((doc, i) => {
        const e = doc.data();
        pdf.text(`${i + 1}. ${e.event} (${new Date(e.ts).toLocaleDateString()})`, 14, 70 + i * 8);
    });
    const pdfBuffer = pdf.output("arraybuffer");
    // Upload to Firebase Storage
    const bucket = (0, storage_1.getStorage)().bucket();
    const fileName = `reports/investor_report_${new Date().toISOString().slice(0, 7)}.pdf`;
    const file = bucket.file(fileName);
    await file.save(Buffer.from(pdfBuffer), {
        contentType: "application/pdf",
        resumable: false,
        public: false,
    });
    // Save metadata in Firestore
    await firebase_admin_1.adminDB.collection("reports").add({
        type: "monthly_investor",
        period: startDate,
        revenue: totalRevenue,
        events: eventsSnap.size,
        createdAt: new Date(),
        storagePath: fileName,
    });
    // Email investors
    await mail_1.default.send({
        to: process.env.INVESTOR_EMAILS.split(","),
        from: "noreply@rentfax.ai",
        subject: "📊 RentFAX Monthly Investor Report",
        text: "Attached is the monthly investor report. You can also download it from your dashboard.",
        attachments: [
            {
                filename: "RentFAX_Monthly_Report.pdf",
                content: Buffer.from(pdfBuffer).toString("base64"),
                type: "application/pdf",
                disposition: "attachment",
            },
        ],
    });
    console.log("Monthly report stored + emailed ✅");
    return null;
});
//# sourceMappingURL=monthlyReport.js.map