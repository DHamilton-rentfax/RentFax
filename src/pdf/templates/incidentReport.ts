 import { generatePDF } from "../utils/generatePdf";

export async function incidentReportPDF({
  incident,
  renter,
  tenant
}: any) {
  const sections = [];

  sections.push({
    heading: "Incident Details",
    body: [
      `Type: ${incident.type}`,
      `Amount: $${incident.amount}`,
      `Status: ${incident.status}`,
      `Description: ${incident.description}`
    ]
  });

  sections.push({
    heading: "Renter Involved",
    body: [
      `${renter.firstName} ${renter.lastName}`,
      renter.email,
      renter.phone
    ]
  });

  return await generatePDF({
    title: "Incident Report",
    tenant,
    contentSections: sections
  });
}
