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
exports.generateClientReports = void 0;
const functions = __importStar(require("firebase-functions"));
const firebase_admin_1 = require("../lib/firebase-admin");
const storage_1 = require("firebase-admin/storage");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const jspdf_1 = require("jspdf");
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
exports.generateClientReports = functions.pubsub
    .schedule("0 9 1 * *") // 1st of every month
    .timeZone("America/New_York")
    .onRun(async () => {
    const orgsSnap = await firebase_admin_1.adminDB.collection("orgs").get();
    for (const orgDoc of orgsSnap.docs) {
        const orgId = orgDoc.id;
        const orgData = orgDoc.data();
        // Check plan or add-ons
        const plan = orgData.plan;
        const addons = orgData.addons || [];
        if (plan !== "enterprise" && !addons.includes("addon_client_reports_monthly")) {
            continue; // skip if not entitled
        }
        // Aggregate usage
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        const usageSnap = await firebase_admin_1.adminDB
            .collection("usage")
            .doc(orgId)
            .collection("events")
            .where("timestamp", ">=", startDate)
            .get();
        const usageStats = {
            reportsRun: usageSnap.size,
            riskFlags: usageSnap.docs.filter((d) => d.data().type === "RISK_FLAG").length,
            disputes: usageSnap.docs.filter((d) => d.data().type === "DISPUTE").length,
        };
        // PDF generation
        const pdf = new jspdf_1.jsPDF();
        pdf.setFontSize(18);
        pdf.text(`RentFAX Monthly Report – ${orgData.name}`, 14, 20);
        pdf.setFontSize(12);
        pdf.text(`Period: ${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`, 14, 35);
        pdf.text(`Reports Run: ${usageStats.reportsRun}`, 14, 50);
        pdf.text(`Risk Flags Triggered: ${usageStats.riskFlags}`, 14, 60);
        pdf.text(`Disputes Logged: ${usageStats.disputes}`, 14, 70);
        const pdfBuffer = pdf.output("arraybuffer");
        // Upload to Storage
        const bucket = (0, storage_1.getStorage)().bucket();
        const fileName = `client-reports/${orgId}_${new Date().toISOString().slice(0, 7)}.pdf`;
        const file = bucket.file(fileName);
        await file.save(Buffer.from(pdfBuffer), {
            contentType: "application/pdf",
            resumable: false,
            public: false,
        });
        // Save metadata
        await firebase_admin_1.adminDB.collection("reports").add({
            orgId,
            type: "client_monthly",
            storagePath: fileName,
            createdAt: new Date(),
            usage: usageStats,
        });
        // Email to org admins
        if (orgData.adminEmail) {
            await mail_1.default.send({
                to: orgData.adminEmail,
                from: "noreply@rentfax.ai",
                subject: `📑 Monthly Report – ${orgData.name}`,
                text: `Attached is your RentFAX monthly usage report.`,
                attachments: [
                    {
                        filename: "RentFAX_Client_Report.pdf",
                        content: Buffer.from(pdfBuffer).toString("base64"),
                        type: "application/pdf",
                        disposition: "attachment",
                    },
                ],
            });
        }
        console.log(`Report sent for org ${orgId}`);
    }
    return null;
});
//# sourceMappingURL=clientReports.js.map