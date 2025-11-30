"use server";

import { Dispute } from "@/types/dispute";

import { getAllDisputes } from "./get-all-disputes";

function convertToCSV(data: Dispute[]) {
  const headers = [
    "ID",
    "Renter Name",
    "Status",
    "Incident Amount",
    "Resolution Status",
  ];
  const rows = data.map((d) =>
    [d.id, d.renter.name, d.status, d.incident.amount, d.adminNote || ""].join(
      ",",
    ),
  );
  return [headers.join(","), ...rows].join("\n");
}

export async function exportDisputesToCsv(): Promise<string> {
  const disputes = await getAllDisputes();
  return convertToCSV(disputes);
}
