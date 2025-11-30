import { fetchPDLProfile } from "./pdl";
import { normalizePDLRecord } from "./normalize";

export async function getPublicRecords(query: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  const pdlData = await fetchPDLProfile(query);
  return normalizePDLRecord(pdlData);
}
