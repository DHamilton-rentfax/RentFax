import { generatePDF } from "../utils/generatePdf";

export async function renterReportPDF({
  renter,
  incidents,
  disputes,
  fraud,
  tenant
}: any) {
  const sections = [];

  sections.push({
    heading: "Renter Profile",
    body: [
      `Name: ${renter.firstName} ${renter.lastName}`,
      `Email: ${renter.email}`,
      `Phone: ${renter.phone}`,
      renter.address ? `Address: ${renter.address}` : ""
    ]
  });

  sections.push({
    heading: "Incident History",
    body:
      incidents.length === 0
        ? ["No incidents reported."]
        : incidents.map((i: any) => {
            return `${i.type} - $${i.amount} — ${i.status}`;
          })
  });

  sections.push({
    heading: "Disputes",
    body:
      disputes.length === 0
        ? ["No disputes submitted."]
        : disputes.map((d: any) => {
            return `${d.status} — ${d.explanation}`;
          })
  });

  sections.push({
    heading: "Fraud Signals",
    body:
      fraud.length === 0
        ? ["No fraud indicators detected."]
        : fraud.map((f: any) => {
            return `${f.type} — score ${f.confidence * 100}%`;
          })
  });

  sections.push({
    heading: "AI Summary",
    body: renter.aiSummary
      ? renter.aiSummary.split("\n")
      : ["No AI summary available."]
  });

  return await generatePDF({
    title: "Renter Report",
    tenant,
    contentSections: sections
  });
}
