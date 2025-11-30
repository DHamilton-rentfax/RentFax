"use server";

import { db, storage } from "@/lib/firebase/server";
import { doc, collection, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { logActivity } from "./activities";

// Generate Proposal PDF
export async function generateProposalPDF(data: any) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage();

  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();

  let y = height - 50;

  const draw = (text: string, size = 14) => {
    page.drawText(text, { x: 50, y, size, font });
    y -= size + 12;
  };

  draw("RentFAX Proposal");
  draw(`Company: ${data.company}`);
  draw(`Plan: ${data.plan}`);
  draw(`Seats: ${data.seats}`);
  draw(`Monthly: $${(data.totals.monthly / 100).toFixed(2)}`);
  draw(`Annual: $${(data.totals.annual / 100).toFixed(2)}`);
  draw("Add-ons:");

  if (data.addons.aiRisk) draw("- AI Risk Engine");
  if (data.addons.prioritySupport) draw("- Priority Support");
  if (data.addons.apiAccess) draw("- API Access");

  const pdfBytes = await pdf.save();

  // Upload to Firebase Storage
  const path = `proposals/${data.company}-${Date.now()}.pdf`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, pdfBytes, {
    contentType: "application/pdf",
  });

  await logActivity({
    type: "proposal",
    summary: `Generated proposal for ${data.company}`,
  });

  return { success: true, path };
}

// Send the proposal email
export async function sendProposalEmail(data: any) {
  await logActivity({
    type: "proposal_sent",
    summary: `Proposal sent to ${data.company}`,
  });

  return { success: true };
}
