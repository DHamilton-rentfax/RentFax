import * as functions from "firebase-functions";
import { adminDB } from "../../src/lib/firebase-admin";
import { getStorage } from "firebase-admin/storage";
import sgMail from "@sendgrid/mail";
import { jsPDF } from "jspdf";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const generateClientReports = functions.pubsub
  .schedule("0 9 1 * *") // 1st of every month
  .timeZone("America/New_York")
  .onRun(async () => {
    const orgsSnap = await adminDB.collection("orgs").get();

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

      const usageSnap = await adminDB
        .collection("usage")
        .doc(orgId)
        .collection("events")
        .where("timestamp", ">=", startDate)
        .get();

      const usageStats = {
        reportsRun: usageSnap.size,
        riskFlags: usageSnap.docs.filter((d: any) => d.data().type === "RISK_FLAG").length,
        disputes: usageSnap.docs.filter((d: any) => d.data().type === "DISPUTE").length,
      };

      // PDF generation
      const pdf = new jsPDF();
      pdf.setFontSize(18);
      pdf.text(`RentFAX Monthly Report – ${orgData.name}`, 14, 20);

      pdf.setFontSize(12);
      pdf.text(`Period: ${startDate.toLocaleDateString()} - ${new Date().toLocaleDateString()}`, 14, 35);
      pdf.text(`Reports Run: ${usageStats.reportsRun}`, 14, 50);
      pdf.text(`Risk Flags Triggered: ${usageStats.riskFlags}`, 14, 60);
      pdf.text(`Disputes Logged: ${usageStats.disputes}`, 14, 70);

      const pdfBuffer = pdf.output("arraybuffer");

      // Upload to Storage
      const bucket = getStorage().bucket();
      const fileName = `client-reports/${orgId}_${new Date().toISOString().slice(0, 7)}.pdf`;
      const file = bucket.file(fileName);

      await file.save(Buffer.from(pdfBuffer), {
        contentType: "application/pdf",
        resumable: false,
        public: false,
      });

      // Save metadata
      await adminDB.collection("reports").add({
        orgId,
        type: "client_monthly",
        storagePath: fileName,
        createdAt: new Date(),
        usage: usageStats,
      });

      // Email to org admins
      if (orgData.adminEmail) {
        await sgMail.send({
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
